export interface MetricSample {
  name: string
  labels: Record<string, string>
  value: number
}

export interface AgentPerformance {
  name: string
  completed: number
  failed: number
  successRate: number
}

export interface MonitoringSnapshot {
  serviceHealthy: boolean
  environment: string
  totalTickets: number
  openTickets: number
  completedWorkflows: number
  failedWorkflows: number
  pendingReviews: number
  approvals: number
  rejections: number
  edits: number
  regenerations: number
  averageWorkflowSeconds: number
  averageRetrievalSeconds: number
  agents: AgentPerformance[]
}
