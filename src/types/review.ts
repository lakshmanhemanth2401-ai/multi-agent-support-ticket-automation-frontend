import type { ClassificationResult, KnowledgeSearchResult, SolutionResult } from './ticket'

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'edited' | 'regenerate_requested'
export type ReviewAction = 'approve' | 'edit' | 'reject' | 'regenerate'

export interface Review {
  id: number
  ticketId: number
  workflowThreadId: string | null
  generatedSubject: string | null
  generatedResponse: string | null
  status: ReviewStatus
  reviewer: string | null
  reviewerComments: string | null
  editedSubject: string | null
  editedResponse: string | null
  version: number
  createdAt: string
  updatedAt: string
  reviewedAt: string | null
}

export interface GeneratedResponse {
  subject: string
  body: string
  confidence: number
  escalation_required: boolean
  supporting_sources: Array<{ source: string; title?: string | null; relevance_score: number }>
}

export interface WorkflowDetail {
  thread_id: string
  status: 'awaiting_review' | 'completed'
  review: unknown
  response: GeneratedResponse
  classification?: ClassificationResult | null
  knowledge?: KnowledgeSearchResult | null
  solution?: SolutionResult | null
  confidence?: number
  escalation_required?: boolean
}

export interface SubmitReviewPayload {
  action: ReviewAction
  reviewer: string
  comments?: string
  edited_subject?: string
  edited_response?: string
}
