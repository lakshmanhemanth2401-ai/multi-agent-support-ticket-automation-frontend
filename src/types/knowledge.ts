export interface KnowledgeDocument {
  id: number | string
  title: string
  source: string
  content?: string
  metadata: Record<string, unknown>
  createdAt?: string
  chunkCount?: number
}

export interface KnowledgeSearchChunk {
  id?: string
  content: string
  source: string
  relevanceScore: number
  metadata: Record<string, unknown>
}

export interface KnowledgeSearchResponse {
  query: string
  results: KnowledgeSearchChunk[]
}
