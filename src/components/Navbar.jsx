import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-6 sm:top-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-warm-white/50 bg-warm-white/80 px-4 py-3 shadow-lg shadow-charcoal/5 backdrop-blur-xl sm:px-6">
        <Link to="/" className="font-display text-xl font-semibold text-forest">
          PlanIT
        </Link>

        {/* <nav className="hidden items-center gap-8 text-sm font-medium text-charcoal/80 md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-terracotta">
            How It Works
          </a>
          <a href="#about" className="transition-colors hover:text-terracotta">
            About Us
          </a>
        </nav> */}

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-charcoal/80 transition-colors hover:text-terracotta"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-warm-white shadow-md shadow-terracotta/30 transition-transform hover:-translate-y-0.5"
          >
            Plan With Us
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
