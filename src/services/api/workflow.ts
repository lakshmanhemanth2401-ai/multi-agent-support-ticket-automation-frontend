import type { WorkflowDetail } from '../../types/review'

type BackendWorkflow = Omit<WorkflowDetail, 'response' | 'knowledge'> & {
  generated_response: WorkflowDetail['response']
  knowledge: { chunks: NonNullable<WorkflowDetail['knowledge']>['results']; confidence: number; sufficient: boolean }
}
export function normalizeWorkflow(data: BackendWorkflow): WorkflowDetail {
  return { ...data, response: data.generated_response, knowledge: { results: data.knowledge.chunks, confidence: data.knowledge.confidence, sufficient: data.knowledge.sufficient, reason: null, query: '' } }
}
