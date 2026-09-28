export interface AuditEvent {
  id: number
  ticketId: number
  action: string
  details: Record<string, string | number | boolean | null>
  createdAt: string
}
