import axios from 'axios'
import { Activity, Bot, CheckCircle2, Clock3, Gauge, RefreshCw, Ticket, XCircle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { PageSkeleton } from '../../components/common/Skeleton'
import { Tooltip } from '../../components/common/Tooltip'
import { getMonitoringSnapshot } from '../../services/endpoints/monitoring'
import type { MonitoringSnapshot } from '../../types/monitoring'
import type { LucideIcon } from 'lucide-react'

function MetricCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string | number; detail: string; icon: LucideIcon; tone: string }) {
  return <Card className="p-5 transition-shadow hover:shadow-card"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{value}</p><p className="mt-2 text-xs text-slate-500">{detail}</p></div><Tooltip label={detail}><span className={`rounded-xl p-2.5 ${tone}`}><Icon aria-hidden="true" className="h-5 w-5" /></span></Tooltip></div></Card>
}

function percent(value: number) { return `${Math.round(value * 100)}%` }

export function MonitoringPage() {
  const [snapshot, setSnapshot] = useState<MonitoringSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true)
    else setLoading(true)
    setError('')
    try { setSnapshot(await getMonitoringSnapshot()) }
    catch (requestError) { setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || requestError.message : 'Unable to load monitoring data.') }
    finally { setLoading(false); setRefreshing(false) }
  }, [])
  useEffect(() => { void load() }, [load])
  if (loading) return <PageSkeleton />
  if (error || !snapshot) return <Card className="mx-auto max-w-4xl"><ErrorState title="Monitoring unavailable" message={error || 'No monitoring snapshot was returned.'} onRetry={() => void load()} /></Card>
  const reviewTotal = snapshot.approvals + snapshot.rejections + snapshot.edits + snapshot.regenerations
  const reviewBars = [{ label: 'Approved', value: snapshot.approvals, color: 'bg-emerald-500' }, { label: 'Rejected', value: snapshot.rejections, color: 'bg-rose-500' }, { label: 'Edited', value: snapshot.edits, color: 'bg-blue-500' }, { label: 'Regenerated', value: snapshot.regenerations, color: 'bg-purple-500' }]

  return <div className="mx-auto max-w-[1450px] space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="flex items-center gap-2"><p className="text-sm font-semibold text-brand-600">System observability</p><Badge tone={snapshot.serviceHealthy ? 'green' : 'rose'} dot>{snapshot.serviceHealthy ? 'API healthy' : 'API degraded'}</Badge></div><h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">Monitoring</h1><p className="mt-2 text-sm text-slate-500">Live workflow, agent, review, and ticket metrics from the backend.</p></div><Button variant="secondary" loading={refreshing} icon={<RefreshCw className="h-4 w-4" />} onClick={() => void load(true)}>Refresh metrics</Button></div><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total tickets" value={snapshot.totalTickets} detail={`${snapshot.openTickets} currently open`} icon={Ticket} tone="bg-blue-50 text-blue-600" /><MetricCard label="Completed workflows" value={snapshot.completedWorkflows} detail={`${snapshot.failedWorkflows} failed`} icon={Activity} tone="bg-emerald-50 text-emerald-600" /><MetricCard label="Pending reviews" value={snapshot.pendingReviews} detail={`${reviewTotal} decisions recorded`} icon={Clock3} tone="bg-amber-50 text-amber-600" /><MetricCard label="Average workflow" value={`${snapshot.averageWorkflowSeconds.toFixed(2)}s`} detail={`${snapshot.averageRetrievalSeconds.toFixed(2)}s retrieval average`} icon={Gauge} tone="bg-purple-50 text-purple-600" /></section><section className="grid gap-6 xl:grid-cols-2"><Card className="p-6"><div className="flex items-center gap-3"><span className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Bot className="h-5 w-5" /></span><div><h2 className="font-extrabold text-ink">Agent performance</h2><p className="text-xs text-slate-500">Execution success by workflow agent</p></div></div>{snapshot.agents.length === 0 ? <EmptyState title="No agent executions yet" message="Agent performance will appear after tickets run through the workflow." /> : <div className="mt-6 space-y-5">{snapshot.agents.map((agent) => <div key={agent.name}><div className="mb-2 flex items-center justify-between"><div><p className="text-sm font-bold capitalize text-slate-700">{agent.name.replace(/_/g, ' ')}</p><p className="text-xs text-slate-400">{agent.completed} completed · {agent.failed} failed</p></div><span className="text-sm font-extrabold text-indigo-700">{percent(agent.successRate)}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: percent(agent.successRate) }} /></div></div>)}</div>}</Card><Card className="p-6"><div className="flex items-center gap-3"><span className="rounded-lg bg-emerald-50 p-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" /></span><div><h2 className="font-extrabold text-ink">Review decisions</h2><p className="text-xs text-slate-500">Approval and rework activity</p></div></div>{reviewTotal === 0 ? <EmptyState title="No review decisions yet" message="Approval and rejection metrics will appear after human review." /> : <div className="mt-6 space-y-5">{reviewBars.map((item) => <div key={item.label}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-slate-600">{item.label}</span><span className="font-bold text-slate-800">{item.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${reviewTotal ? (item.value / reviewTotal) * 100 : 0}%` }} /></div></div>)}</div>}</Card></section><Card className="p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-extrabold text-ink">Workflow status</h2><p className="mt-1 text-xs text-slate-500">Current environment: {snapshot.environment}</p></div><div className="flex flex-wrap gap-5"><div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="font-semibold text-slate-600">{snapshot.completedWorkflows} completed</span></div><div className="flex items-center gap-2 text-sm"><XCircle className="h-4 w-4 text-rose-500" /><span className="font-semibold text-slate-600">{snapshot.failedWorkflows} failed</span></div><div className="flex items-center gap-2 text-sm"><Clock3 className="h-4 w-4 text-amber-500" /><span className="font-semibold text-slate-600">{snapshot.pendingReviews} awaiting review</span></div></div></div></Card></div>
}
