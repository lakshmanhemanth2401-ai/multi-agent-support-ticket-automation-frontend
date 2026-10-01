import { apiClient } from '../api/client'
import type { AuditEvent } from '../../types/audit'
import type { Page } from '../../types/pagination'

interface AuditApiResponse {
  id: number
  ticket_id: number
  action: string
  details: Record<string, unknown> | null
  created_at: string
}

const SAFE_DETAIL_KEYS = new Set(['agent', 'status', 'stage', 'reviewer', 'decision', 'reason', 'category', 'priority', 'confidence', 'source_count', 'result_count', 'error_type'])

function safeDetails(details: Record<string, unknown> | null): AuditEvent['details'] {
  if (!details) return {}
  return Object.fromEntries(Object.entries(details).filter(([key, value]) => SAFE_DETAIL_KEYS.has(key) && (value === null || ['string', 'number', 'boolean'].includes(typeof value))).map(([key, value]) => [key, value as string | number | boolean | null]))
}

export async function getTicketAudit(ticketId: string): Promise<AuditEvent[]> {
  const { data } = await apiClient.get<Page<AuditApiResponse>>(`/tickets/${ticketId}/audit`, { params: { offset: 0, limit: 100 } })
  return data.items.map((event) => ({ id: event.id, ticketId: event.ticket_id, action: event.action, details: safeDetails(event.details), createdAt: event.created_at })).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}
