import { FileSearch, Gauge } from 'lucide-react'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'
import type { KnowledgeSearchChunk } from '../../types/knowledge'

export function SearchResultCard({ result, rank }: { result: KnowledgeSearchChunk; rank: number }) {
  const relevance = Math.max(0, Math.min(1, result.relevanceScore))
  return <Card className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-purple-50 text-sm font-extrabold text-purple-700">{rank}</span><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-800">{result.metadata.title ? String(result.metadata.title) : result.source}</p><p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500"><FileSearch className="h-3.5 w-3.5 shrink-0" />{result.source}</p></div></div><Badge tone={relevance >= 0.7 ? 'green' : relevance >= 0.4 ? 'amber' : 'slate'}><Gauge className="mr-1 h-3 w-3" />{Math.round(relevance * 100)}% relevant</Badge></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{result.content}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${relevance >= 0.7 ? 'bg-emerald-500' : relevance >= 0.4 ? 'bg-amber-500' : 'bg-slate-400'}`} style={{ width: `${relevance * 100}%` }} /></div></Card>
}
