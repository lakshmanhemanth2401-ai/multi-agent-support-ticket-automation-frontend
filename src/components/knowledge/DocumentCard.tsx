import { BookOpenText, Calendar, Database, FileText } from 'lucide-react'
import { Card } from '../common/Card'
import type { KnowledgeDocument } from '../../types/knowledge'

function metadataEntries(metadata: Record<string, unknown>) {
  return Object.entries(metadata).filter(([key, value]) => !['source', 'title', 'chunk_count'].includes(key) && ['string', 'number', 'boolean'].includes(typeof value)).slice(0, 3)
}

export function DocumentCard({ document }: { document: KnowledgeDocument }) {
  const metadata = metadataEntries(document.metadata)
  return <Card className="flex h-full flex-col p-5 transition hover:border-brand-200 hover:shadow-md"><div className="flex items-start justify-between gap-3"><span className="rounded-xl bg-blue-50 p-2.5 text-brand-600"><FileText className="h-5 w-5" /></span>{document.chunkCount !== undefined && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{document.chunkCount} chunks</span>}</div><h3 className="mt-4 font-bold leading-6 text-ink">{document.title}</h3>{document.content && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{document.content}</p>}<div className="mt-auto space-y-2 pt-5 text-xs text-slate-500"><p className="flex items-center gap-2"><Database className="h-3.5 w-3.5" /><span className="truncate">{document.source}</span></p>{document.createdAt && <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{new Date(document.createdAt).toLocaleDateString()}</p>}{metadata.map(([key, value]) => <p key={key} className="flex items-center gap-2"><BookOpenText className="h-3.5 w-3.5" /><span className="capitalize">{key.replace(/_/g, ' ')}:</span> <span className="truncate font-medium text-slate-600">{String(value)}</span></p>)}</div></Card>
}
