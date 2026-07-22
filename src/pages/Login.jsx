import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext.jsx'
import SplitAuthLayout from '../components/SplitAuthLayout.jsx'
import GoogleButton from '../components/GoogleButton.jsx'
import EmailInput from '../components/EmailInput.jsx'
import PasswordInput from '../components/PasswordInput.jsx'

function Login() {
  const { signInWithEmail, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signInWithEmail(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate(from, { replace: true })
  }

  async function handleGoogle() {
    setError('')
    const { error } = await signInWithGoogle()
    if (error) setError(error.message)
  }

  return (
    <SplitAuthLayout
      title="Welcome back"
      subtitle="Log in to keep planning your trip."
      footer={
        <>
          <span className="text-charcoal">Don't have an account?</span>{' '}
          <Link to="/signup" className="font-medium text-terracotta">
            Sign up
          </Link>
        </>
      }
    >
      <GoogleButton onClick={handleGoogle} />

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-warm-gray">
        <span className="h-px flex-1 bg-charcoal/10" />
        or
        <span className="h-px flex-1 bg-charcoal/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-charcoal">
            Email
          </label>
          <EmailInput id="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-charcoal">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-terracotta">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-warm-white shadow-md shadow-terracotta/30 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </SplitAuthLayout>
  )
}

export default Login