import { describe, expect, it } from 'vitest'
import { parsePrometheusMetrics } from '../../src/services/endpoints/monitoring'

describe('parsePrometheusMetrics', () => {
  it('parses counters, labels, and histogram values', () => {
    const samples = parsePrometheusMetrics('# HELP ignored\nsupport_reviews_total{action="approve"} 3\nsupport_workflow_duration_seconds_sum{status="completed"} 12.5\nsupport_workflow_duration_seconds_count{status="completed"} 5')
    expect(samples).toHaveLength(3)
    expect(samples[0]).toEqual({ name: 'support_reviews_total', labels: { action: 'approve' }, value: 3 })
    expect(samples[1].value).toBe(12.5)
  })
})
