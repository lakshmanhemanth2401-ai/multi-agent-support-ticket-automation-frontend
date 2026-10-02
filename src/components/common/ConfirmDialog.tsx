import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from './Button'

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger = false, loading = false, onCancel, onConfirm }: { open: boolean; title: string; message: string; confirmLabel?: string; danger?: boolean; loading?: boolean; onCancel: () => void; onConfirm: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { if (open) cancelRef.current?.focus() }, [open])
  if (!open) return null
  return <div className="fixed inset-0 z-[70] grid place-items-center p-4" role="presentation"><button aria-label="Close confirmation" className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" onClick={onCancel} /><section role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description" className="relative w-full max-w-md rounded-2xl border bg-white p-6 shadow-elevated"><button aria-label="Close" className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onCancel}><X className="h-5 w-5" /></button><span className={`grid h-11 w-11 place-items-center rounded-full ${danger ? 'bg-danger-50 text-danger-600' : 'bg-warning-50 text-warning-600'}`}><AlertTriangle className="h-5 w-5" /></span><h2 id="confirm-title" className="mt-4 text-lg font-extrabold text-ink">{title}</h2><p id="confirm-description" className="mt-2 text-sm leading-6 text-slate-600">{message}</p><div className="mt-6 flex justify-end gap-3"><Button ref={cancelRef} variant="secondary" onClick={onCancel}>Cancel</Button><Button variant={danger ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>{confirmLabel}</Button></div></section></div>
}
