import { FileQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
export function NotFoundPage() { return <div className="grid min-h-[70vh] place-items-center"><Card className="max-w-lg p-8 text-center"><FileQuestion className="mx-auto h-10 w-10 text-brand-600" /><p className="mt-4 text-sm font-bold text-brand-700">404</p><h1 className="mt-1 text-2xl font-extrabold text-ink">Page not found</h1><p className="mt-2 text-sm text-slate-500">The page may have moved or the address may be incorrect.</p><Link className="mt-6 inline-flex" to="/dashboard"><Button>Return to dashboard</Button></Link></Card></div> }
