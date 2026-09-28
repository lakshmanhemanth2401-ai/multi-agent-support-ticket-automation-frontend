import axios from 'axios'
import { Plus, RefreshCw, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { Loading } from '../../components/common/Loading'
import { PriorityBadge, StatusBadge } from '../../components/tickets/TicketBadges'
import { listTickets } from '../../services/endpoints/tickets'
import type { Ticket } from '../../types/ticket'

function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'The ticket service is unreachable. Confirm the backend is running and CORS allows this frontend.'
    return error.response.data?.message || `The ticket service returned ${error.response.status}.`
  }
  return 'An unexpected error occurred while loading tickets.'
}

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const loadTickets = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true)
    else setLoading(true)
    setError('')
    try { setTickets(await listTickets()) }
    catch (requestError) { setError(errorMessage(requestError)) }
    finally { setLoading(false); setRefreshing(false) }
  }, [])
  useEffect(() => { void loadTickets() }, [loadTickets])
  const filtered = useMemo(() => tickets.filter((ticket) => `${ticket.id} ${ticket.title} ${ticket.category ?? ''}`.toLowerCase().includes(query.toLowerCase())), [query, tickets])

  return <div className="mx-auto max-w-[1400px] space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-extrabold text-ink">Tickets</h1><p className="mt-1 text-sm text-slate-500">Live support requests from the ticket service.</p></div><div className="flex gap-2"><Button variant="secondary" loading={refreshing} icon={<RefreshCw className="h-4 w-4" />} onClick={() => void loadTickets(true)}>Refresh</Button><Link to="/tickets/new"><Button icon={<Plus className="h-4 w-4" />}>Create ticket</Button></Link></div></div><Card className="overflow-hidden"><div className="border-b p-4"><div className="relative max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-lg border bg-white pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" placeholder="Search by title, ID, or category" /></div></div>{loading ? <Loading label="Loading tickets from the backend…" /> : error ? <ErrorState message={error} onRetry={() => void loadTickets()} /> : filtered.length === 0 ? <EmptyState title={query ? 'No matching tickets' : 'No tickets yet'} message={query ? 'Try a different title, ID, or category.' : 'Create the first support ticket to begin.'} /> : <div className="divide-y">{filtered.map((ticket) => <Link key={ticket.id} to={`/tickets/${ticket.id}`} className="grid gap-3 p-5 transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_140px_130px] sm:items-center"><div><div className="flex items-center gap-2"><span className="text-xs font-bold text-brand-600">#{ticket.id}</span><span className="text-xs text-slate-400">· {ticket.category || 'Uncategorized'}</span></div><p className="mt-1 font-semibold text-slate-800">{ticket.title}</p><p className="mt-1 text-xs text-slate-500">Created {new Date(ticket.createdAt).toLocaleString()}</p></div><PriorityBadge priority={ticket.priority} /><StatusBadge status={ticket.status} /></Link>)}</div>}</Card></div>
}
