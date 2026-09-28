export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Ticket {
  id: string
  subject: string
  description: string
  customer: string
  customerEmail?: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  assignee?: string
}

export interface CreateTicketPayload {
  subject: string
  description: string
  customer: string
  category: string
  priority: TicketPriority
}
