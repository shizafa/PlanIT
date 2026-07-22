import { useState } from 'react'
import { useAuth } from '../lib/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

function Settings() {
  const { user, session } = useAuth()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [notifyUpcoming, setNotifyUpcoming] = useState(user?.user_metadata?.notify_upcoming ?? true)

  const [deleteConfirming, setDeleteConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handleChangePassword(event) {
    event.preventDefault()
    setPasswordError('')
    setPasswordMessage('')

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setPasswordSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordSaving(false)

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordMessage('Password updated.')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  async function handleToggleNotify() {
    const next = !notifyUpcoming
    setNotifyUpcoming(next)
    await supabase.auth.updateUser({ data: { notify_upcoming: next } })
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    setDeleteError('')
    try {
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload.error || 'Failed to delete account.')
      }
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (err) {
      setDeleteError(err.message)
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-warm-white">Settings</h1>
        <p className="mt-1 text-warm-white/60">Manage your account.</p>
      </div>

      <section className="rounded-2xl border border-warm-white/15 bg-warm-white/10 p-6 backdrop-blur-xl">
        <h2 className="font-display text-lg text-warm-white">Change password</h2>
        <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password"
            className="w-full rounded-lg border border-charcoal/15 bg-warm-white px-4 py-2.5 text-charcoal focus:border-forest focus:outline-none"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-lg border border-charcoal/15 bg-warm-white px-4 py-2.5 text-charcoal focus:border-forest focus:outline-none"
          />
          {passwordError && <p className="text-sm text-terracotta">{passwordError}</p>}
          {passwordMessage && <p className="text-sm text-warm-white/70">{passwordMessage}</p>}
          <button
            type="submit"
            disabled={passwordSaving}
            className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-warm-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {passwordSaving ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-warm-white/15 bg-warm-white/10 p-6 backdrop-blur-xl">
        <h2 className="font-display text-lg text-warm-white">Notifications</h2>
        <p className="mt-1 text-xs text-warm-white/50">
          Saved to your account, but email sending isn't set up yet — this won't trigger a real email.
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-warm-white">Email me about upcoming trips</span>
          <button
            type="button"
            onClick={handleToggleNotify}
            aria-pressed={notifyUpcoming}
            className={`h-6 w-11 shrink-0 rounded-full transition-colors ${
              notifyUpcoming ? 'bg-terracotta' : 'bg-warm-white/20'
            }`}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-warm-white transition-transform ${
                notifyUpcoming ? 'translate-x-[22px]' : ''
              }`}
            />
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-6 backdrop-blur-xl">
        <h2 className="font-display text-lg text-warm-white">Delete account</h2>
        <p className="mt-1 text-sm text-warm-white/60">
          Permanently deletes your account and all your trips. This can't be undone.
        </p>
        {deleteError && <p className="mt-2 text-sm text-terracotta">{deleteError}</p>}
        {!deleteConfirming ? (
          <button
            type="button"
            onClick={() => setDeleteConfirming(true)}
            className="mt-4 rounded-full border border-terracotta px-5 py-2.5 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-warm-white"
          >
            Delete my account
          </button>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-warm-white disabled:opacity-60"
            >
              {deleting ? 'Deleting…' : 'Yes, delete permanently'}
            </button>
            <button
              type="button"
              onClick={() => setDeleteConfirming(false)}
              className="text-sm text-warm-white/60 hover:text-warm-white"
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default Settings
