export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketAnalysisStatus = 'not_started' | 'queued' | 'running' | 'awaiting_review' | 'completed' | 'failed'

export interface Ticket {
  id: number | string
  title: string
  description: string
  customer?: string
  customerEmail?: string
  category: string | null
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  updatedAt?: string
  assignee?: string
  workflowThreadId?: string | null
  analysisStatus?: TicketAnalysisStatus
  analysisError?: string | null
}

export interface CreateTicketPayload {
  subject: string
  description: string
  customer: string
  category: string
  priority: TicketPriority
}

export interface ClassificationResult {
  category: string
  priority: TicketPriority
  confidence: number
  reasoning_summary?: string
}

export interface KnowledgeChunk {
  content: string
  source: string
  relevance_score: number
  distance?: number
  metadata?: Record<string, unknown>
}

export interface KnowledgeSearchResult {
  results: KnowledgeChunk[]
  confidence: number
  sufficient: boolean
  reason: string | null
  query: string
}

export interface SupportingSource {
  source: string
  title?: string | null
  relevance_score: number
}

export interface SolutionResult {
  troubleshooting_steps: string[]
  confidence: number
  supporting_sources: SupportingSource[]
  escalation_required: boolean
  escalation_reason: string | null
  summary: string
}

export interface WorkflowAnalysis {
  thread_id: string
  status: 'awaiting_review' | 'completed'
  classification?: ClassificationResult | null
  knowledge?: KnowledgeSearchResult | null
  solution?: SolutionResult | null
  review?: { id: number; ticket_id: number; status: string; workflow_thread_id?: string | null }
  response?: { subject: string; body: string; confidence: number; escalation_required: boolean; supporting_sources?: SupportingSource[] }
}
