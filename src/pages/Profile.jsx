import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../lib/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

function daysBetween(start, end) {
  const ms = new Date(end) - new Date(start)
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1
}

function Profile() {
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '')
  const [nameSaving, setNameSaving] = useState(false)
  const [nameMessage, setNameMessage] = useState('')

  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  const [stats, setStats] = useState({ totalTrips: 0, totalDays: 0 })

  useEffect(() => {
    let cancelled = false

    async function loadStats() {
      const { data } = await supabase.from('trips').select('start_date, end_date')
      if (cancelled || !data) return
      setStats({
        totalTrips: data.length,
        totalDays: data.reduce((sum, trip) => sum + daysBetween(trip.start_date, trip.end_date), 0),
      })
    }

    loadStats()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSaveName(event) {
    event.preventDefault()
    setNameSaving(true)
    setNameMessage('')
    const { error } = await supabase.auth.updateUser({ data: { display_name: displayName } })
    setNameSaving(false)
    setNameMessage(error ? error.message : 'Saved.')
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setAvatarUploading(true)
    setAvatarError('')

    const filePath = `${user.id}/avatar.${file.name.split('.').pop()}`
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setAvatarError(uploadError.message)
      setAvatarUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`
    await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } })
    setAvatarUploading(false)
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayLabel = user?.user_metadata?.display_name || user?.email

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl text-warm-white">Profile</h1>

      <div className="mt-6 rounded-2xl border border-warm-white/15 bg-warm-white/10 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-terracotta text-xl font-semibold text-warm-white"
            aria-label="Change avatar"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              displayLabel?.[0]?.toUpperCase()
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-charcoal/60 text-xs opacity-0 transition-opacity group-hover:opacity-100">
              {avatarUploading ? '…' : 'Edit'}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <div className="min-w-0 flex-1">
            <p className="break-words text-warm-white">{displayLabel}</p>
            <p className="text-sm text-warm-white/60">
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
        {avatarError && <p className="mt-3 text-sm text-terracotta">{avatarError}</p>}

        <form onSubmit={handleSaveName} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Display name"
            className="min-w-0 flex-1 rounded-lg border border-charcoal/15 bg-warm-white px-4 py-2.5 text-charcoal focus:border-forest focus:outline-none"
          />
          <button
            type="submit"
            disabled={nameSaving}
            className="shrink-0 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-warm-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {nameSaving ? 'Saving…' : 'Save'}
          </button>
        </form>
        {nameMessage && <p className="mt-2 text-sm text-warm-white/60">{nameMessage}</p>}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-warm-white/15 bg-warm-white/10 p-6 text-center backdrop-blur-xl">
          <p className="font-display text-3xl text-warm-white">{stats.totalTrips}</p>
          <p className="mt-1 text-sm text-warm-white/60">Total trips</p>
        </div>
        <div className="rounded-2xl border border-warm-white/15 bg-warm-white/10 p-6 text-center backdrop-blur-xl">
          <p className="font-display text-3xl text-warm-white">{stats.totalDays}</p>
          <p className="mt-1 text-sm text-warm-white/60">Days traveled</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
