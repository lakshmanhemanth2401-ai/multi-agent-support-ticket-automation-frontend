import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export function Pagination({ page, pageCount, total, label, onPageChange }: { page: number; pageCount: number; total: number; label: string; onPageChange: (page: number) => void }) {
  if (pageCount <= 1) return null
  return <nav aria-label={`${label} pagination`} className="flex flex-col gap-3 border-t px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="text-slate-500">Page <span className="font-semibold text-slate-700">{page}</span> of {pageCount} · {total} {label}</p><div className="flex gap-2"><Button variant="secondary" aria-label={`Previous ${label} page`} disabled={page === 1} icon={<ChevronLeft className="h-4 w-4" />} onClick={() => onPageChange(page - 1)}>Previous</Button><Button variant="secondary" aria-label={`Next ${label} page`} disabled={page === pageCount} onClick={() => onPageChange(page + 1)}>Next<ChevronRight className="h-4 w-4" /></Button></div></nav>
}
