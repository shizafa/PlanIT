import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext.jsx'
import { LogoutIcon } from './icons.jsx'
import { NAV_ITEMS } from './navItems.js'

function Sidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    navigate('/', { replace: true })
    await signOut()
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-warm-white/10 bg-warm-white/5 px-4 py-6 backdrop-blur-xl lg:flex">
      <Link to="/dashboard" className="px-3 font-display text-xl text-warm-white">
        PlanIT
      </Link>

      <nav className="mt-10 flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-terracotta/20 text-warm-white'
                  : 'text-warm-white/60 hover:bg-warm-white/10 hover:text-warm-white'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-warm-white/60 transition-colors hover:bg-warm-white/10 hover:text-terracotta"
      >
        <LogoutIcon className="h-4 w-4" />
        Logout
      </button>
    </aside>
  )
}

export default Sidebar
