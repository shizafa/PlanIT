import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext.jsx'
import { SearchIcon, BellIcon, MenuIcon } from './icons.jsx'

function Topbar({ onMenuClick }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  function handleSearchSubmit(event) {
    event.preventDefault()
    navigate(query.trim() ? `/trips?q=${encodeURIComponent(query.trim())}` : '/trips')
  }

  async function handleLogout() {
    navigate('/', { replace: true })
    await signOut()
  }

  const displayLabel = user?.user_metadata?.display_name || user?.email
  const avatarUrl = user?.user_metadata?.avatar_url
  const initial = displayLabel?.[0]?.toUpperCase() || '?'

  return (
    <header className="flex items-center justify-between gap-2 border-b border-warm-white/10 bg-warm-white/5 px-4 py-4 backdrop-blur-xl sm:gap-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="shrink-0 rounded-full border border-warm-white/15 p-2 text-warm-white/70 transition-colors hover:text-warm-white lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="h-4 w-4" />
      </button>

      <form onSubmit={handleSearchSubmit} className="max-w-sm flex-1">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-warm-white/40">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="search"
            placeholder="Search your trips…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-full border border-warm-white/15 bg-warm-white/10 py-2 pl-10 pr-4 text-sm text-warm-white placeholder:text-warm-white/40 focus:border-terracotta/50 focus:outline-none"
          />
        </div>
      </form>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((value) => !value)}
            className="rounded-full border border-warm-white/15 p-2 text-warm-white/70 transition-colors hover:text-warm-white"
            aria-label="Notifications"
          >
            <BellIcon className="h-4 w-4" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 z-20 mt-2 w-64 max-w-[80vw] rounded-xl border border-warm-white/15 bg-charcoal/95 p-4 text-sm text-warm-white/70 shadow-xl backdrop-blur-xl">
              No notifications yet.
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex items-center gap-2 rounded-full border border-warm-white/15 py-1.5 pl-1.5 pr-3 text-sm text-warm-white transition-colors hover:border-terracotta/40"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-terracotta text-xs font-semibold text-warm-white">
              {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : initial}
            </span>
            <span className="hidden sm:inline">{displayLabel}</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-48 max-w-[80vw] overflow-hidden rounded-xl border border-warm-white/15 bg-charcoal/95 text-sm shadow-xl backdrop-blur-xl">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-warm-white/80 hover:bg-warm-white/10 hover:text-warm-white"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-warm-white/80 hover:bg-warm-white/10 hover:text-warm-white"
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full px-4 py-2.5 text-left text-terracotta hover:bg-warm-white/10"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
