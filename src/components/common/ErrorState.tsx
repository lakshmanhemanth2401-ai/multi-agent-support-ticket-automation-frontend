import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

export function ErrorState({ title = 'Something went wrong', message, onRetry }: { title?: string; message: string; onRetry?: () => void }) {
  return <div className="flex flex-col items-center px-6 py-14 text-center"><span className="mb-4 rounded-full bg-rose-50 p-3 text-rose-600"><AlertTriangle className="h-6 w-6" /></span><h3 className="text-base font-bold text-slate-800">{title}</h3><p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>{onRetry && <Button className="mt-5" variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={onRetry}>Try again</Button>}</div>
}
