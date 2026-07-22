import { Link } from 'react-router-dom'
import SceneBackground from './SceneBackground.jsx'
import BrandPanel from './BrandPanel.jsx'

function SplitAuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
      <SceneBackground tone="day" />

      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-3xl border border-warm-white/40 shadow-2xl shadow-charcoal/10">
        <div className="w-full bg-warm-white/45 px-8 py-12 backdrop-blur-2xl sm:px-11 lg:w-1/2">
          <div className="mx-auto w-full max-w-sm">
            <Link to="/" className="font-display text-lg text-forest">
              PlanIT
            </Link>
            <h1 className="mt-8 font-display text-2xl text-charcoal">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-warm-gray">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center text-sm text-warm-gray">{footer}</div>}
          </div>
        </div>
        <BrandPanel />
      </div>
    </div>
  )
}

export default SplitAuthLayout
