import { Link } from 'react-router-dom'

function ClosingVideo() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-charcoal py-32 sm:py-40">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero-bg.webm"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/50 to-charcoal/70" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cream to-transparent sm:h-56" />

      <div className="relative z-10 mx-auto max-w-xl px-6 text-center">
        <h2 className="font-display text-3xl text-warm-white sm:text-4xl">
          Ready to plan your next trip?
        </h2>
        <p className="mt-4 text-warm-white/80">
          Tell PlanIT where you want to go — the itinerary writes itself.
        </p>
        <Link
          to="/signup"
          className="mt-8 inline-block rounded-full bg-terracotta px-8 py-3.5 text-sm font-semibold text-warm-white shadow-lg shadow-terracotta/30 transition-transform hover:-translate-y-0.5"
        >
          Get started free
        </Link>
      </div>
    </section>
  )
}

export default ClosingVideo
