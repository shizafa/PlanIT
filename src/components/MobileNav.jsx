import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext.jsx'
import { LogoutIcon } from './icons.jsx'
import { NAV_ITEMS } from './navItems.js'

function MobileNav({ open, onClose }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    onClose()
    navigate('/', { replace: true })
    await signOut()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col bg-charcoal/95 px-4 py-6 backdrop-blur-2xl lg:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          >
            <div className="flex items-center justify-between px-3">
              <Link to="/dashboard" onClick={onClose} className="font-display text-xl text-warm-white">
                PlanIT
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="text-warm-white/60 transition-colors hover:text-warm-white"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="mt-10 flex-1 space-y-1">
              {NAV_ITEMS.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileNav
