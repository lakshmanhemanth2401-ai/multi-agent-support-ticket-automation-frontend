import axios from 'axios'
import { BookOpenText, RefreshCw, Search, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { Loading } from '../../components/common/Loading'
import { DocumentCard } from '../../components/knowledge/DocumentCard'
import { SearchResultCard } from '../../components/knowledge/SearchResultCard'
import { listKnowledgeDocuments, searchKnowledge } from '../../services/endpoints/knowledge'
import type { KnowledgeDocument, KnowledgeSearchChunk } from '../../types/knowledge'

function requestError(error: unknown, action: string) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) return `The backend does not expose the knowledge ${action} endpoint yet.`
    if (!error.response) return 'The knowledge service is unreachable. Confirm the backend is running.'
    return error.response.data?.message || `Knowledge ${action} failed with status ${error.response.status}.`
  }
  return `Knowledge ${action} failed unexpectedly.`
}

export function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [documentsLoading, setDocumentsLoading] = useState(true)
  const [documentsError, setDocumentsError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [query, setQuery] = useState('')
  const [searchedQuery, setSearchedQuery] = useState('')
  const [results, setResults] = useState<KnowledgeSearchChunk[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const loadDocuments = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true)
    else setDocumentsLoading(true)
    setDocumentsError('')
    try { setDocuments(await listKnowledgeDocuments()) }
    catch (error) { setDocumentsError(requestError(error, 'document-list')) }
    finally { setDocumentsLoading(false); setRefreshing(false) }
  }, [])
  useEffect(() => { void loadDocuments() }, [loadDocuments])

  async function handleSearch(event: FormEvent) {
    event.preventDefault()
    const cleanQuery = query.trim()
    if (!cleanQuery) { setSearchError('Enter a question or search phrase.'); return }
    setSearching(true); setSearchError(''); setSearchedQuery(cleanQuery)
    try { setResults((await searchKnowledge(cleanQuery)).results) }
    catch (error) { setResults(null); setSearchError(requestError(error, 'search')) }
    finally { setSearching(false) }
  }

  return <div className="mx-auto max-w-[1400px] space-y-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand-600">Knowledge workspace</p><h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">Knowledge Base</h1><p className="mt-2 text-sm text-slate-500">Search indexed support knowledge and inspect the evidence returned by ChromaDB.</p></div><Button variant="secondary" loading={refreshing} icon={<RefreshCw className="h-4 w-4" />} onClick={() => void loadDocuments(true)}>Refresh documents</Button></div><Card className="overflow-hidden border-brand-100 bg-gradient-to-br from-white via-white to-blue-50/60"><div className="p-5 sm:p-7"><div className="flex items-center gap-3"><span className="rounded-xl bg-brand-600 p-2.5 text-white"><Sparkles className="h-5 w-5" /></span><div><h2 className="font-extrabold text-ink">Semantic knowledge search</h2><p className="mt-0.5 text-xs text-slate-500">Results are ranked by vector relevance through the backend.</p></div></div><form onSubmit={handleSearch} className="mt-5 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => { setQuery(event.target.value); setSearchError('') }} className="h-12 w-full rounded-xl border bg-white pl-12 pr-4 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" placeholder="Ask about SSO, billing, data exports, API incidents…" /></div><Button className="h-12 px-6" type="submit" loading={searching}>Search knowledge</Button></form></div>{searching ? <div className="border-t bg-white"><Loading label="Searching indexed knowledge in ChromaDB…" /></div> : searchError ? <div className="border-t bg-white"><ErrorState title="Search unavailable" message={searchError} onRetry={searchedQuery ? () => { setQuery(searchedQuery); void searchKnowledge(searchedQuery).then((response) => { setResults(response.results); setSearchError('') }).catch((error) => setSearchError(requestError(error, 'search'))) } : undefined} /></div> : results !== null ? <div className="border-t bg-slate-50/60 p-5 sm:p-7"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-ink">Results for “{searchedQuery}”</h2><span className="text-xs font-semibold text-slate-500">{results.length} chunks</span></div>{results.length === 0 ? <Card><EmptyState title="No relevant knowledge found" message="Try broader terms or describe the issue in a different way." /></Card> : <div className="space-y-3">{results.map((result, index) => <SearchResultCard key={result.id || `${result.source}-${index}`} result={result} rank={index + 1} />)}</div>}</div> : null}</Card><section><div className="mb-4 flex items-center gap-2"><BookOpenText className="h-5 w-5 text-brand-600" /><div><h2 className="font-extrabold text-ink">Indexed documents</h2><p className="text-xs text-slate-500">Sources currently available to support agents</p></div></div>{documentsLoading ? <Card><Loading label="Loading indexed documents…" /></Card> : documentsError ? <Card><ErrorState title="Documents unavailable" message={documentsError} onRetry={() => void loadDocuments()} /></Card> : documents.length === 0 ? <Card><EmptyState title="No indexed documents" message="Ingest knowledge documents through the backend to make them available here." /></Card> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{documents.map((document) => <DocumentCard key={document.id} document={document} />)}</div>}</section></div>
}
