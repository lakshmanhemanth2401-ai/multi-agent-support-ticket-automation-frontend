import { AlertTriangle, ArrowUpRight, BarChart3, CalendarDays, CheckCircle2, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Ticket } from '../../types/ticket'
import { Card } from '../common/Card'
import { EmptyState } from '../common/EmptyState'
import { PriorityBadge, StatusBadge } from '../tickets/TicketBadges'
import { buildDashboardAnalytics, dashboardPriorities } from './analyticsModel'

function SectionHeading({ icon: Icon, title, detail }: { icon: typeof BarChart3; title: string; detail: string }) {
  return <div className="flex items-center gap-3"><span className="rounded-xl bg-brand-50 p-2 text-brand-600"><Icon className="h-5 w-5" aria-hidden="true" /></span><div><h2 className="font-extrabold text-ink">{title}</h2><p className="text-xs text-slate-500">{detail}</p></div></div>
}

export function TicketVolumeTrend({ tickets }: { tickets: Ticket[] }) {
  const { trend } = buildDashboardAnalytics(tickets)
  const max = Math.max(...trend.map((day) => day.count), 1)
  return <Card className="p-5 sm:p-6"><SectionHeading icon={CalendarDays} title="Ticket intake" detail="New requests over the last seven days" /><div className="mt-7 grid h-44 grid-cols-7 items-end gap-2 sm:gap-3" aria-label="Seven-day ticket intake chart">{trend.map((day) => <div key={day.key} className="flex h-full flex-col items-center justify-end gap-2"><span className="text-xs font-bold text-slate-600">{day.count}</span><div className="flex h-28 w-full items-end overflow-hidden rounded-t-lg bg-slate-100"><div className="w-full rounded-t-lg bg-gradient-to-t from-brand-700 to-brand-500 transition-all" style={{ height: `${Math.max(day.count ? 12 : 3, (day.count / max) * 100)}%` }} /></div><span className="text-[11px] font-semibold text-slate-500">{day.label}</span></div>)}</div></Card>
}

export function PriorityAnalytics({ tickets }: { tickets: Ticket[] }) {
  const { priorityCounts } = buildDashboardAnalytics(tickets)
  const total = Math.max(tickets.length, 1)
  return <Card className="p-5 sm:p-6"><SectionHeading icon={AlertTriangle} title="Priority mix" detail="Workload grouped by urgency" /><div className="mt-6 space-y-4">{dashboardPriorities.map((priority) => <div key={priority.key}><div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold text-slate-600">{priority.label}</span><span className="text-sm font-extrabold text-ink">{priorityCounts[priority.key]} <span className="font-medium text-slate-400">({Math.round((priorityCounts[priority.key] / total) * 100)}%)</span></span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${priority.color}`} style={{ width: `${(priorityCounts[priority.key] / total) * 100}%` }} /></div></div>)}</div></Card>
}

export function CategoryAnalytics({ tickets }: { tickets: Ticket[] }) {
  const { categories } = buildDashboardAnalytics(tickets)
  const max = Math.max(...categories.map(([, count]) => count), 1)
  return <Card className="p-5 sm:p-6"><SectionHeading icon={BarChart3} title="Top categories" detail="Most common support request types" />{categories.length === 0 ? <EmptyState title="No category data" message="Category analytics will appear when tickets are created." /> : <div className="mt-6 space-y-4">{categories.map(([category, count], index) => <div key={category} className="grid grid-cols-[minmax(100px,1fr)_2fr_auto] items-center gap-3"><span className="truncate text-sm font-semibold text-slate-600" title={category}>{category}</span><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${(count / max) * 100}%`, opacity: 1 - index * 0.12 }} /></div><span className="w-6 text-right text-sm font-extrabold text-ink">{count}</span></div>)}</div>}</Card>
}

export function OperationalInsights({ tickets }: { tickets: Ticket[] }) {
  const analytics = buildDashboardAnalytics(tickets)
  const age = analytics.oldestActive ? Math.max(0, Math.floor((Date.now() - Date.parse(analytics.oldestActive.createdAt)) / 86_400_000)) : 0
  return <Card className="p-5 sm:p-6"><SectionHeading icon={CheckCircle2} title="Operational insights" detail="Signals that help teams prioritize work" /><div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resolution rate</p><p className="mt-2 text-2xl font-extrabold text-emerald-700">{analytics.resolutionRate}%</p><p className="mt-1 text-xs text-slate-500">{analytics.completed} completed tickets</p></div><div className="rounded-xl border bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">High-risk queue</p><p className="mt-2 text-2xl font-extrabold text-rose-700">{analytics.highRisk}</p><p className="mt-1 text-xs text-slate-500">Urgent or high active tickets</p></div><div className="rounded-xl border bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Oldest active</p><p className="mt-2 text-2xl font-extrabold text-amber-700">{analytics.oldestActive ? `${age}d` : '—'}</p><p className="mt-1 truncate text-xs text-slate-500">{analytics.oldestActive?.title || 'No active backlog'}</p></div></div></Card>
}

export function AttentionQueue({ tickets }: { tickets: Ticket[] }) {
  const { attention } = buildDashboardAnalytics(tickets)
  return <Card className="overflow-hidden"><div className="flex items-center justify-between border-b px-5 py-4 sm:px-6"><div><h2 className="font-extrabold text-ink">Needs attention</h2><p className="mt-1 text-xs text-slate-500">Highest-priority active work</p></div><Clock3 className="h-5 w-5 text-amber-500" aria-hidden="true" /></div>{attention.length === 0 ? <EmptyState title="Queue is clear" message="There are no active tickets requiring attention." /> : <div className="divide-y">{attention.map((ticket) => <Link key={ticket.id} to={`/tickets/${ticket.id}`} className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50 sm:px-6"><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{ticket.title}</p><p className="mt-1 text-xs text-slate-500">#{ticket.id} · {ticket.category || 'Uncategorized'}</p></div><div className="hidden gap-2 sm:flex"><PriorityBadge priority={ticket.priority} /><StatusBadge status={ticket.status} /></div><ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" /></Link>)}</div>}</Card>
}
