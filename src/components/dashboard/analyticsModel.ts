import type { Ticket, TicketPriority } from '../../types/ticket'

export const dashboardPriorities: Array<{ key: TicketPriority; label: string; color: string }> = [
  { key: 'urgent', label: 'Urgent', color: 'bg-rose-500' },
  { key: 'high', label: 'High', color: 'bg-orange-500' },
  { key: 'medium', label: 'Medium', color: 'bg-amber-400' },
  { key: 'low', label: 'Low', color: 'bg-emerald-500' },
]

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export function buildDashboardAnalytics(tickets: Ticket[], now = new Date()) {
  const completed = tickets.filter((ticket) => ticket.status === 'resolved' || ticket.status === 'closed').length
  const active = tickets.filter((ticket) => ticket.status === 'open' || ticket.status === 'in_progress')
  const priorityCounts = Object.fromEntries(dashboardPriorities.map(({ key }) => [key, tickets.filter((ticket) => ticket.priority === key).length])) as Record<TicketPriority, number>
  const categories = Object.entries(tickets.reduce<Record<string, number>>((result, ticket) => {
    const category = ticket.category?.trim() || 'Uncategorized'
    result[category] = (result[category] || 0) + 1
    return result
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const trend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now)
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - (6 - index))
    return { key: dateKey(date), label: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date), count: tickets.filter((ticket) => dateKey(new Date(ticket.createdAt)) === dateKey(date)).length }
  })
  const oldestActive = [...active].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))[0]
  const attention = [...active].sort((a, b) => {
    const weight: Record<TicketPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 }
    return weight[b.priority] - weight[a.priority] || Date.parse(a.createdAt) - Date.parse(b.createdAt)
  }).slice(0, 4)
  return { completed, active: active.length, resolutionRate: tickets.length ? Math.round((completed / tickets.length) * 100) : 0, highRisk: active.filter((ticket) => ticket.priority === 'urgent' || ticket.priority === 'high').length, priorityCounts, categories, trend, oldestActive, attention }
}
