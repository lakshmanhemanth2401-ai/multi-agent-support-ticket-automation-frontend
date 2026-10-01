import { Bot, LogIn } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { useAuth } from '../../contexts/AuthContext'
import { apiErrorMessage } from '../../services/api/errors'

export function LoginPage() {
  const { user, login } = useAuth(); const navigate = useNavigate(); const location = useLocation()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); if (!email.trim() || password.length < 8) { setError('Enter a valid email and password of at least 8 characters.'); return } setSubmitting(true); try { await login(email.trim(), password); const from = (location.state as { from?: string } | null)?.from; navigate(from || '/dashboard', { replace: true }) } catch (requestError) { setError(apiErrorMessage(requestError, 'Sign in failed.')) } finally { setSubmitting(false) } }
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-4"><Card className="w-full max-w-md p-7 sm:p-9"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white"><Bot className="h-6 w-6" /></span><div><h1 className="text-xl font-extrabold text-ink">Sign in to SupportFlow</h1><p className="text-sm text-slate-500">Use your enterprise support account.</p></div></div><form className="mt-7 space-y-5" onSubmit={submit}><Input label="Email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /><Input label="Password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />{error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<Button className="w-full" type="submit" loading={submitting} icon={<LogIn className="h-4 w-4" />}>Sign in</Button></form></Card></main>
}
