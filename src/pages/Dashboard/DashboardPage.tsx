import axios from 'axios'
import { CheckCircle2, Clock3, LifeBuoy, RefreshCw, Timer } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/common/Button'
import { ErrorState } from '../../components/common/ErrorState'
import { Loading } from '../../components/common/Loading'
import { RecentTicketsTable } from '../../components/dashboard/RecentTicketsTable'
import { StatusOverview } from '../../components/dashboard/StatusOverview'
import { SummaryCard } from '../../components/dashboard/SummaryCard'
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

  return <div className="mx-auto max-w-[1400px] space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-extrabold text-ink">Dashboard</h1><p className="mt-1 text-sm text-slate-500">Live overview of the support workflow.</p></div><Button variant="secondary" loading={refreshing} icon={<RefreshCw className="h-4 w-4" />} onClick={() => void loadDashboard(true)}>Refresh</Button></div>{loading ? <Loading label="Loading dashboard from the backend…" /> : error ? <ErrorState message={error} onRetry={() => void loadDashboard()} /> : <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard title="Total tickets" value={String(tickets.length)} detail="Across all support queues" icon={LifeBuoy} tone="blue" /><SummaryCard title="Open" value={String(counts.open)} detail="Waiting for processing" icon={Clock3} tone="amber" /><SummaryCard title="In progress" value={String(counts.inProgress)} detail="Currently being handled" icon={Timer} tone="purple" /><SummaryCard title="Resolved" value={String(counts.resolved + counts.closed)} detail="Resolved or closed" icon={CheckCircle2} tone="green" /></div><div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.7fr)]"><RecentTicketsTable tickets={recentTickets} /><StatusOverview counts={counts} /></div></>}</div>
}
