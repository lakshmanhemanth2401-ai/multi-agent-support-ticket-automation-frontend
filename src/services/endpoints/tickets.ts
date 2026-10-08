import type { CreateTicketPayload, Ticket, TicketAnalysisStatus, TicketPriority, TicketStatus, WorkflowAnalysis } from '../../types/ticket'
import { apiClient } from '../api/client'
import type { Page } from '../../types/pagination'
import { normalizeWorkflow } from '../api/workflow'
import type { WorkflowDetail } from '../../types/review'

interface TicketApiResponse {
  id: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: string | null
  created_at: string
  updated_at: string
  workflow_thread_id?: string | null
  analysis_status?: TicketAnalysisStatus
  analysis_error?: string | null
}

function normalizeTicket(ticket: TicketApiResponse): Ticket {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    category: ticket.category,
    createdAt: ticket.created_at,
    updatedAt: ticket.updated_at,
    workflowThreadId: ticket.workflow_thread_id,
    analysisStatus: ticket.analysis_status,
    analysisError: ticket.analysis_error,
  }
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  const { data } = await apiClient.post<TicketApiResponse>('/tickets', {
    title: payload.subject,
    description: payload.description,
    category: payload.category || null,
    priority: payload.priority,
  })
  return normalizeTicket(data)
}

export async function getTicket(ticketId: string): Promise<Ticket> {
  const { data } = await apiClient.get<TicketApiResponse>(`/tickets/${ticketId}`)
  return normalizeTicket(data)
}

export async function listTickets(): Promise<Ticket[]> {
  const { data } = await apiClient.get<Page<TicketApiResponse>>('/tickets', { params: { offset: 0, limit: 100 } })
  return data.items.map(normalizeTicket)
}

export async function runTicketAnalysis(ticketId: string): Promise<WorkflowAnalysis> {
  const { data } = await apiClient.post<WorkflowDetail>(`/workflows/tickets/${ticketId}`)
  return normalizeWorkflow(data as never) as unknown as WorkflowAnalysis
}

export async function getTicketAnalysis(threadId: string): Promise<WorkflowAnalysis> {
  const { data } = await apiClient.get<WorkflowDetail>(`/workflows/${threadId}`)
  return normalizeWorkflow(data as never) as unknown as WorkflowAnalysis
}
