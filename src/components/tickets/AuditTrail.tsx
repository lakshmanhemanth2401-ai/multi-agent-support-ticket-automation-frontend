import axios from 'axios'
import { Bot, CheckCircle2, Clock3, History, RefreshCw, UserCheck } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { Loading } from '../common/Loading'
import { getTicketAudit } from '../../services/endpoints/audit'
import type { AuditEvent } from '../../types/audit'

function eventPresentation(action: string) {
  const readable = action.replace(/_/g, ' ')
  if (action.startsWith('review_')) return { name: 'Human review', summary: readable.replace('review ', ''), icon: UserCheck, color: 'bg-purple-100 text-purple-700' }
  if (action === 'ticket_created') return { name: 'Ticket service', summary: 'Ticket created', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' }
  if (action.startsWith('workflow_')) return { name: 'Workflow', summary: readable, icon: History, color: 'bg-amber-100 text-amber-700' }
  const parts = action.split('_')
  const status = parts.pop() || 'updated'
  return { name: parts.join(' ') || 'Support agent', summary: status, icon: Bot, color: 'bg-blue-100 text-blue-700' }
}

function safeSummary(details: AuditEvent['details']) {
  const entries = Object.entries(details)
  if (!entries.length) return ''
  return entries.map(([key, value]) => `${key.replace(/_/g, ' ')}: ${String(value)}`).join(' · ')
}

export function AuditTrail({ ticketId }: { ticketId: string }) {
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true)
    else setLoading(true)
    setError('')
    try { setEvents(await getTicketAudit(ticketId)) }
    catch (requestError) { setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || requestError.message : 'Unable to load audit history.') }
    finally { setLoading(false); setRefreshing(false) }
  }, [ticketId])
  useEffect(() => { void load() }, [load])

  return <Card className="overflow-hidden"><div className="flex items-center justify-between border-b px-6 py-5"><div className="flex items-center gap-3"><span className="rounded-lg bg-slate-100 p-2 text-slate-600"><History className="h-5 w-5" /></span><div><h2 className="font-extrabold text-ink">Audit Trail</h2><p className="text-xs text-slate-500">Sanitized ticket, agent, and review activity</p></div></div><Button variant="ghost" loading={refreshing} icon={<RefreshCw className="h-4 w-4" />} onClick={() => void load(true)}>Refresh</Button></div>{loading ? <Loading label="Loading audit history…" /> : error ? <ErrorState title="Audit history unavailable" message={error} onRetry={() => void load()} /> : events.length === 0 ? <EmptyState title="No audit events" message="Ticket and agent activity will appear here chronologically." /> : <ol className="px-6 py-2">{events.map((event, index) => { const presentation = eventPresentation(event.action); const Icon = presentation.icon; const details = safeSummary(event.details); return <li key={event.id} className="relative flex gap-4 py-5">{index < events.length - 1 && <span className="absolute left-[17px] top-11 h-[calc(100%-28px)] w-px bg-slate-200" />}<span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ${presentation.color}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center"><div><p className="text-sm font-bold capitalize text-slate-800">{presentation.name}</p><p className="mt-0.5 text-sm capitalize text-slate-600">{presentation.summary}</p></div><time className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400"><Clock3 className="h-3.5 w-3.5" />{new Date(event.createdAt).toLocaleString()}</time></div>{details && <p className="mt-2 text-xs capitalize leading-5 text-slate-500">{details}</p>}</div></li>})}</ol>}</Card>
}
