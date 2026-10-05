import { describe, expect, it } from 'vitest'
import { buildDashboardAnalytics } from '../../src/components/dashboard/analyticsModel'
import type { Ticket } from '../../src/types/ticket'

const tickets: Ticket[] = [
  { id: 1, title: 'Urgent login issue', description: '', category: 'Account', priority: 'urgent', status: 'open', createdAt: '2026-10-05T12:00:00Z' },
  { id: 2, title: 'Billing question', description: '', category: 'Billing', priority: 'medium', status: 'resolved', createdAt: '2026-10-04T12:00:00Z' },
  { id: 3, title: 'Second account issue', description: '', category: 'Account', priority: 'high', status: 'in_progress', createdAt: '2026-10-03T12:00:00Z' },
]

describe('buildDashboardAnalytics', () => {
  it('calculates operational dashboard metrics', () => {
    const analytics = buildDashboardAnalytics(tickets, new Date('2026-10-05T16:00:00Z'))
    expect(analytics.active).toBe(2)
    expect(analytics.completed).toBe(1)
    expect(analytics.resolutionRate).toBe(33)
    expect(analytics.highRisk).toBe(2)
    expect(analytics.categories[0]).toEqual(['Account', 2])
    expect(analytics.priorityCounts.urgent).toBe(1)
    expect(analytics.attention.map((ticket) => ticket.id)).toEqual([1, 3])
  })

  it('returns safe empty-state metrics', () => {
    const analytics = buildDashboardAnalytics([], new Date('2026-10-05T16:00:00Z'))
    expect(analytics.resolutionRate).toBe(0)
    expect(analytics.attention).toEqual([])
    expect(analytics.trend).toHaveLength(7)
  })
})
