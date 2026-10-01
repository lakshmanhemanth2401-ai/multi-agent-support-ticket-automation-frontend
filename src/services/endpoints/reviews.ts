import { apiClient } from '../api/client'
import type { Review, ReviewStatus, SubmitReviewPayload, WorkflowDetail } from '../../types/review'
import type { Page } from '../../types/pagination'
import { normalizeWorkflow } from '../api/workflow'

interface ReviewApiResponse {
  id: number
  ticket_id: number
  workflow_thread_id: string | null
  generated_subject: string | null
  generated_response: string | null
  status: ReviewStatus
  reviewer: string | null
  reviewer_comments: string | null
  edited_subject: string | null
  edited_response: string | null
  version: number
  created_at: string
  updated_at: string
  reviewed_at: string | null
}

function normalizeReview(review: ReviewApiResponse): Review {
  return {
    id: review.id,
    ticketId: review.ticket_id,
    workflowThreadId: review.workflow_thread_id,
    generatedSubject: review.generated_subject,
    generatedResponse: review.generated_response,
    status: review.status,
    reviewer: review.reviewer,
    reviewerComments: review.reviewer_comments,
    editedSubject: review.edited_subject,
    editedResponse: review.edited_response,
    version: review.version,
    createdAt: review.created_at,
    updatedAt: review.updated_at,
    reviewedAt: review.reviewed_at,
  }
}

export async function listReviews(status?: ReviewStatus): Promise<Review[]> {
  const { data } = await apiClient.get<Page<ReviewApiResponse>>('/reviews', { params: { ...(status ? { status } : {}), offset: 0, limit: 100 } })
  return data.items.map(normalizeReview)
}

export async function getReview(reviewId: string): Promise<Review> {
  const { data } = await apiClient.get<ReviewApiResponse>(`/reviews/${reviewId}`)
  return normalizeReview(data)
}

export async function getWorkflow(threadId: string): Promise<WorkflowDetail> {
  const { data } = await apiClient.get<WorkflowDetail>(`/workflows/${threadId}`)
  return normalizeWorkflow(data as never)
}

export async function submitReview(threadId: string, payload: SubmitReviewPayload): Promise<WorkflowDetail> {
  const { data } = await apiClient.post<WorkflowDetail>(`/workflows/${threadId}/review`, payload)
  return normalizeWorkflow(data as never)
}
