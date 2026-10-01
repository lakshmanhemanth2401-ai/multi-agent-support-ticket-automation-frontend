import { apiClient } from '../api/client'
import type { KnowledgeDocument, KnowledgeSearchChunk, KnowledgeSearchResponse } from '../../types/knowledge'

type UnknownRecord = Record<string, unknown>

function record(value: unknown): UnknownRecord {
  return value && typeof value === 'object' ? value as UnknownRecord : {}
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function number(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function normalizeDocument(value: unknown, index: number): KnowledgeDocument {
  const item = record(value)
  const metadata = record(item.metadata ?? item.document_metadata)
  return {
    id: typeof item.id === 'string' || typeof item.id === 'number' ? item.id : `document-${index}`,
    title: text(item.title, text(metadata.title, 'Untitled document')),
    source: text(item.source, text(metadata.source, 'Unknown source')),
    content: text(item.content) || undefined,
    metadata,
    createdAt: text(item.created_at) || undefined,
    chunkCount: number(item.chunk_count, number(metadata.chunk_count)) || undefined,
  }
}

function normalizeChunk(value: unknown): KnowledgeSearchChunk {
  const item = record(value)
  const metadata = record(item.metadata)
  return {
    id: text(item.id) || undefined,
    content: text(item.content, text(item.text)),
    source: text(item.source, text(metadata.source, 'Unknown source')),
    relevanceScore: number(item.relevance_score, number(item.relevance, number(item.score))),
    metadata,
  }
}

export async function listKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  const { data } = await apiClient.get<unknown>('/knowledge/documents')
  const payload = record(data)
  const values = Array.isArray(payload.items) ? payload.items : []
  return values.map(normalizeDocument)
}

export async function searchKnowledge(query: string, topK = 5): Promise<KnowledgeSearchResponse> {
  const { data } = await apiClient.post<unknown>('/knowledge/search', { query, top_k: topK })
  const payload = record(data)
  const values = Array.isArray(payload.items) ? payload.items : []
  return { query: text(payload.query, query), results: values.map(normalizeChunk) }
}
