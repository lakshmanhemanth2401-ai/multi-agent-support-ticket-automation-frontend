import axios from 'axios'
import { listReviews } from './reviews'
import { listTickets } from './tickets'
import type { MetricSample, MonitoringSnapshot } from '../../types/monitoring'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
const SERVICE_BASE = API_BASE.replace(/\/api\/v1\/?$/, '')

function parseLabels(raw = ''): Record<string, string> {
  return Object.fromEntries([...raw.matchAll(/([a-zA-Z_][\w]*)="([^"]*)"/g)].map((match) => [match[1], match[2]]))
}

export function parsePrometheusMetrics(text: string): MetricSample[] {
  return text.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^([a-zA-Z_:][\w:]*)?(?:\{([^}]*)\})?\s+(-?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?|NaN|[+-]Inf)$/)
    if (!match?.[1]) return []
    return [{ name: match[1], labels: parseLabels(match[2]), value: Number(match[3]) }]
  })
}

function sum(samples: MetricSample[], name: string, labels: Record<string, string> = {}) {
  return samples.filter((sample) => sample.name === name && Object.entries(labels).every(([key, value]) => sample.labels[key] === value)).reduce((total, sample) => total + sample.value, 0)
}

function average(samples: MetricSample[], prefix: string) {
  const count = sum(samples, `${prefix}_count`)
  return count > 0 ? sum(samples, `${prefix}_sum`) / count : 0
}

export async function getMonitoringSnapshot(): Promise<MonitoringSnapshot> {
  const [healthResponse, metricsResponse, tickets, reviews] = await Promise.all([
    axios.get<{ status: string; environment: string }>(`${SERVICE_BASE}/health`, { timeout: 10_000 }),
    axios.get<string>(`${SERVICE_BASE}/metrics`, { timeout: 10_000, transformResponse: [(data) => data] }),
    listTickets(),
    listReviews(),
  ])
  const samples = parsePrometheusMetrics(metricsResponse.data)
  const agentNames = [...new Set(samples.filter((sample) => sample.name === 'support_agent_executions_total').map((sample) => sample.labels.agent).filter(Boolean))]
  const agents = agentNames.map((name) => {
    const completed = sum(samples, 'support_agent_executions_total', { agent: name, status: 'completed' })
    const failed = sum(samples, 'support_agent_executions_total', { agent: name, status: 'failed' }) + sum(samples, 'support_agent_failures_total', { agent: name })
    return { name, completed, failed, successRate: completed + failed > 0 ? completed / (completed + failed) : 0 }
  })
  return {
    serviceHealthy: healthResponse.data.status === 'healthy',
    environment: healthResponse.data.environment,
    totalTickets: tickets.length,
    openTickets: tickets.filter((ticket) => ticket.status === 'open' || ticket.status === 'in_progress').length,
    completedWorkflows: sum(samples, 'support_tickets_processed_total', { status: 'completed' }),
    failedWorkflows: sum(samples, 'support_tickets_processed_total', { status: 'failed' }),
    pendingReviews: reviews.filter((review) => review.status === 'pending').length,
    approvals: sum(samples, 'support_reviews_total', { action: 'approve' }),
    rejections: sum(samples, 'support_reviews_total', { action: 'reject' }),
    edits: sum(samples, 'support_reviews_total', { action: 'edit' }),
    regenerations: sum(samples, 'support_reviews_total', { action: 'regenerate' }),
    averageWorkflowSeconds: average(samples, 'support_workflow_duration_seconds'),
    averageRetrievalSeconds: average(samples, 'support_retrieval_duration_seconds'),
    agents,
  }
}
