import axios from 'axios'
import { AlertTriangle, CheckCircle2, LifeBuoy, RefreshCw, Timer } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/common/Button'
import { ErrorState } from '../../components/common/ErrorState'
import { Loading } from '../../components/common/Loading'
import { RecentTicketsTable } from '../../components/dashboard/RecentTicketsTable'
import { StatusOverview } from '../../components/dashboard/StatusOverview'
import { SummaryCard } from '../../components/dashboard/SummaryCard'
import { AttentionQueue, CategoryAnalytics, OperationalInsights, PriorityAnalytics, TicketVolumeTrend } from '../../components/dashboard/DashboardAnalytics'
import { buildDashboardAnalytics } from '../../components/dashboard/analyticsModel'
import { listTickets } from '../../services/endpoints/tickets'
import type { Ticket } from '../../types/ticket'

function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'The ticket service is unreachable. Confirm the backend is running and CORS allows this frontend.'
    return error.response.data?.message || `The ticket service returned ${error.response.status}.`
  }
  return 'An unexpected error occurred while loading the dashboard.'
}

export function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const loadDashboard = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true)
    else setLoading(true)
    setError('')
    try { setTickets(await listTickets()) }
    catch (requestError) { setError(errorMessage(requestError)) }
    finally { setLoading(false); setRefreshing(false) }
  }, [])
  useEffect(() => { void loadDashboard() }, [loadDashboard])
  const counts = useMemo(() => ({
    open: tickets.filter((ticket) => ticket.status === 'open').length,
    inProgress: tickets.filter((ticket) => ticket.status === 'in_progress').length,
    resolved: tickets.filter((ticket) => ticket.status === 'resolved').length,
    closed: tickets.filter((ticket) => ticket.status === 'closed').length,
  }), [tickets])
  const recentTickets = useMemo(() => [...tickets].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5), [tickets])
  const analytics = useMemo(() => buildDashboardAnalytics(tickets), [tickets])

  return <div className="mx-auto max-w-[1450px] space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold text-brand-600">Support analytics</p><h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">Dashboard</h1><p className="mt-1 text-sm text-slate-500">Ticket demand, service health, and priority signals in one view.</p></div><Button variant="secondary" loading={refreshing} icon={<RefreshCw className="h-4 w-4" />} onClick={() => void loadDashboard(true)}>Refresh analytics</Button></div>{loading ? <Loading label="Loading dashboard from the backend…" /> : error ? <ErrorState message={error} onRetry={() => void loadDashboard()} /> : <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard title="Total tickets" value={String(tickets.length)} detail="Across all support queues" icon={LifeBuoy} tone="blue" /><SummaryCard title="Active backlog" value={String(analytics.active)} detail={`${counts.open} open · ${counts.inProgress} in progress`} icon={Timer} tone="purple" /><SummaryCard title="High-risk active" value={String(analytics.highRisk)} detail="Urgent or high priority" icon={AlertTriangle} tone="amber" /><SummaryCard title="Resolution rate" value={`${analytics.resolutionRate}%`} detail={`${counts.resolved + counts.closed} resolved or closed`} icon={CheckCircle2} tone="green" /></div><OperationalInsights tickets={tickets} /><div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]"><TicketVolumeTrend tickets={tickets} /><PriorityAnalytics tickets={tickets} /></div><div className="grid gap-6 xl:grid-cols-2"><CategoryAnalytics tickets={tickets} /><StatusOverview counts={counts} /></div><div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]"><RecentTicketsTable tickets={recentTickets} /><AttentionQueue tickets={tickets} /></div></>}</div>
}
