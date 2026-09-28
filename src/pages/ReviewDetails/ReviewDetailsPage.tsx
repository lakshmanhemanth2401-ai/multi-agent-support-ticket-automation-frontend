import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '../../components/common/Card'

export function ReviewDetailsPage() {
  const { reviewId } = useParams()
  return <div className="mx-auto max-w-4xl"><Link to="/reviews" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" />Back to reviews</Link><Card className="p-8"><p className="text-xs font-bold text-brand-600">{reviewId}</p><h1 className="mt-2 text-2xl font-extrabold text-ink">Review details</h1><p className="mt-3 text-sm leading-6 text-slate-500">Agent response review content will be connected here in a future task.</p></Card></div>
}
