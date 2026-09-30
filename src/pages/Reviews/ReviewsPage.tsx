import axios from 'axios'
import { Clock3, FileCheck2, RefreshCw, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { Loading } from '../../components/common/Loading'
import { Pagination } from '../../components/common/Pagination'
import { ReviewStatusBadge } from '../../components/reviews/ReviewStatusBadge'
import { listReviews } from '../../services/endpoints/reviews'
import type { Review, ReviewStatus } from '../../types/review'

const filters: Array<{ label: string; value: ReviewStatus | 'all' }> = [{ label: 'All', value: 'all' }, { label: 'Pending', value: 'pending' }, { label: 'Approved', value: 'approved' }, { label: 'Edited', value: 'edited' }, { label: 'Rejected', value: 'rejected' }]

export function ReviewsPage() {
  const pageSize = 10
  const [reviews, setReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('pending')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true)
    else setLoading(true)
    setError('')
    try { setReviews(await listReviews(filter === 'all' ? undefined : filter)) }
    catch (requestError) { setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || requestError.message : 'Unable to load reviews.') }
    finally { setLoading(false); setRefreshing(false) }
  }, [filter])
  useEffect(() => { void load() }, [load])
  const visible = useMemo(() => reviews.filter((review) => (filter === 'all' || review.status === filter) && `${review.id} ${review.ticketId} ${review.generatedSubject ?? ''}`.toLowerCase().includes(query.toLowerCase())), [filter, query, reviews])
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize))
  const pageReviews = visible.slice((page - 1) * pageSize, page * pageSize)
  useEffect(() => { setPage(1) }, [filter, query])
  useEffect(() => { if (page > pageCount) setPage(pageCount) }, [page, pageCount])
  const pendingCount = reviews.filter((review) => review.status === 'pending').length

  return <div className="mx-auto max-w-6xl space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand-600">Human-in-the-loop</p><h1 className="mt-1 text-2xl font-extrabold text-ink">Reviews</h1><p className="mt-1 text-sm text-slate-500">Inspect and decide on AI-generated customer responses.</p></div><Button variant="secondary" loading={refreshing} icon={<RefreshCw className="h-4 w-4" />} onClick={() => void load(true)}>Refresh</Button></div><div className="grid gap-4 sm:grid-cols-2"><Card className="flex items-center gap-4 p-5"><span className="rounded-xl bg-amber-50 p-3 text-amber-600"><Clock3 className="h-5 w-5" /></span><div><p className="text-2xl font-extrabold text-ink">{pendingCount}</p><p className="text-xs font-medium text-slate-500">Awaiting human review</p></div></Card><Card className="flex items-center gap-4 p-5"><span className="rounded-xl bg-blue-50 p-3 text-brand-600"><FileCheck2 className="h-5 w-5" /></span><div><p className="text-2xl font-extrabold text-ink">{reviews.length}</p><p className="text-xs font-medium text-slate-500">Total review records</p></div></Card></div><Card className="overflow-hidden"><div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-1.5" role="group" aria-label="Review status filter">{filters.map((item) => <button key={item.value} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)} className={`rounded-lg px-3 py-2 text-xs font-bold capitalize transition ${filter === item.value ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{item.label}</button>)}</div><div className="relative sm:w-72"><Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><label htmlFor="review-search" className="sr-only">Search reviews</label><input id="review-search" value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-lg border pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" placeholder="Search review or ticket" /></div></div>{loading ? <Loading label="Loading review queue…" /> : error ? <ErrorState title="Review queue unavailable" message={error} onRetry={() => void load()} /> : visible.length === 0 ? <EmptyState title="No reviews found" message={reviews.length ? 'No reviews match the current filter.' : 'AI-generated responses awaiting review will appear here.'} /> : <><div className="divide-y">{pageReviews.map((review) => <Link to={`/reviews/${review.id}`} key={review.id} className="grid gap-4 p-5 transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_140px_160px] sm:items-center"><div><div className="flex items-center gap-2"><span className="text-xs font-bold text-brand-600">Review #{review.id}</span><span className="text-xs text-slate-400">· Ticket #{review.ticketId}</span></div><h2 className="mt-1 truncate font-bold text-slate-800">{review.generatedSubject || 'Generated support response'}</h2><p className="mt-1 line-clamp-1 text-xs text-slate-500">{review.generatedResponse || 'Response content is not available.'}</p></div><ReviewStatusBadge status={review.status} /><div className="text-xs text-slate-500 sm:text-right"><p>Version {review.version}</p><p className="mt-1">{new Date(review.updatedAt).toLocaleString()}</p></div></Link>)}</div><Pagination page={page} pageCount={pageCount} total={visible.length} label="reviews" onPageChange={setPage} /></>}</Card></div>
}
