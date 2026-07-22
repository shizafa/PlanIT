import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext.jsx'
import SplitAuthLayout from '../components/SplitAuthLayout.jsx'
import GoogleButton from '../components/GoogleButton.jsx'
import EmailInput from '../components/EmailInput.jsx'
import PasswordInput from '../components/PasswordInput.jsx'

function Signup() {
  const { signUpWithEmail, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const { data, error } = await signUpWithEmail(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data.session) {
      navigate('/dashboard', { replace: true })
    } else {
      setConfirmSent(true)
    }
  }

  async function handleGoogle() {
    setError('')
    const { error } = await signInWithGoogle()
    if (error) setError(error.message)
  }

  if (confirmSent) {
    return (
      <SplitAuthLayout
        title="Check your email"
        subtitle="We've sent you a confirmation link — click it to activate your account, then log in."
      >
        <Link to="/login" className="text-sm font-medium text-terracotta">
          Back to log in
        </Link>
      </SplitAuthLayout>
    )
  }

  return (
    <SplitAuthLayout
      title="Create your account"
      subtitle="Start planning your next trip with PlanIT."
      footer={
        <>
          <span className="text-charcoal">Already have an account?</span>{' '}
          <Link to="/login" className="font-medium text-terracotta">
            Log in
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
            autoComplete="new-password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-1 text-xs text-warm-gray">At least 6 characters.</p>
        </div>

        {error && <p className="text-sm text-terracotta">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-warm-white shadow-md shadow-terracotta/30 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
    </SplitAuthLayout>
  )
}

export default Signup