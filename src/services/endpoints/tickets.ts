import type { CreateTicketPayload, Ticket } from '../../types/ticket'
import { apiClient } from '../api/client'

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  const { data } = await apiClient.post<Ticket>('/tickets', payload)
  return data
}

export async function getTicket(ticketId: string): Promise<Ticket> {
  const { data } = await apiClient.get<Ticket>(`/tickets/${ticketId}`)
  return data
}
