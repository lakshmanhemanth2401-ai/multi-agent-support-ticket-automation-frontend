import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { PriorityBadge, StatusBadge } from '../../components/tickets/TicketBadges'
import { mockTickets } from '../../constants/mockData'

export function TicketsPage() {
  const [query, setQuery] = useState('')
  const tickets = useMemo(() => mockTickets.filter((ticket) => `${ticket.id} ${ticket.subject} ${ticket.customer}`.toLowerCase().includes(query.toLowerCase())), [query])
  return <div className="mx-auto max-w-[1400px] space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-extrabold text-ink">Tickets</h1><p className="mt-1 text-sm text-slate-500">Manage every customer request in one place.</p></div><Link to="/tickets/new"><Button icon={<Plus className="h-4 w-4" />}>Create ticket</Button></Link></div><Card className="overflow-hidden"><div className="border-b p-4"><div className="relative max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-lg border bg-white pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" placeholder="Search tickets or customers" /></div></div>{tickets.length === 0 ? <EmptyState title="No matching tickets" message="Try a different ticket number, subject, or customer name." /> : <div className="divide-y">{tickets.map((ticket) => <Link key={ticket.id} to={`/tickets/${ticket.id}`} className="grid gap-3 p-5 transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_140px_130px] sm:items-center"><div><div className="flex items-center gap-2"><span className="text-xs font-bold text-brand-600">{ticket.id}</span><span className="text-xs text-slate-400">· {ticket.category}</span></div><p className="mt-1 font-semibold text-slate-800">{ticket.subject}</p><p className="mt-1 text-xs text-slate-500">{ticket.customer} · Assigned to {ticket.assignee}</p></div><PriorityBadge priority={ticket.priority} /><StatusBadge status={ticket.status} /></Link>)}</div>}</Card></div>
}
