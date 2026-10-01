import axios from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { apiErrorMessage } from '../../src/services/api/errors'
import { normalizeWorkflow } from '../../src/services/api/workflow'

describe('API helpers', () => {
  it('normalizes safe server and network errors', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(true)
    expect(apiErrorMessage(new Error('private details'), 'Safe fallback')).toBe('Safe fallback')
    expect(apiErrorMessage({ response: undefined })).toMatch(/unreachable/i)
    expect(apiErrorMessage({ response: { status: 403, data: { detail: 'Permission denied' } } })).toBe('Permission denied')
  })

  it('maps the backend workflow evidence contract to UI fields', () => {
    const result = normalizeWorkflow({ thread_id: 'thread-1', status: 'awaiting_review', review: {}, classification: { category: 'account', priority: 'high', confidence: 0.9 }, solution: { summary: 'Reset access', troubleshooting_steps: [], confidence: 0.8, supporting_sources: [], escalation_required: false, escalation_reason: null }, generated_response: { subject: 'Access update', body: 'Follow these steps', confidence: 0.8, escalation_required: false, supporting_sources: [] }, confidence: 0.8, escalation_required: false, knowledge: { chunks: [{ content: 'SSO guide', source: 'guide.md', relevance_score: 0.95, metadata: {} }], confidence: 0.95, sufficient: true } })
    expect(result.response.subject).toBe('Access update')
    expect(result.knowledge?.results[0].source).toBe('guide.md')
  })
})
