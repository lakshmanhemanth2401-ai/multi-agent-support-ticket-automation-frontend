import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
export function AccessDeniedPage() { return <div className="grid min-h-[70vh] place-items-center"><Card className="max-w-lg p-8 text-center"><ShieldAlert className="mx-auto h-10 w-10 text-amber-500" /><h1 className="mt-4 text-2xl font-extrabold text-ink">Access denied</h1><p className="mt-2 text-sm text-slate-500">Your account does not have permission to open this area.</p><Link to="/dashboard" className="mt-6 inline-flex"><Button>Return to dashboard</Button></Link></Card></div> }
