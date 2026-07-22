import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-charcoal">
      {/* Background Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero-bg.webm"
        autoPlay
        loop
        muted
        playsInline
      />

        {/* Overlay — stops fading out well before the bottom, so it doesn't mix with the cream fade below */}
        <div className="absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-charcoal/50 via-charcoal/35 to-transparent" />

        {/* Radial overlay for better text readability */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(0,0,0,0.45),transparent)]" /> */}

        {/* Bottom fade — now blending onto clear video, not dark charcoal */}
        {/* <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-cream from-0% via-cream/70 via-45% to-transparent sm:h-80" />       */}
        {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center">
        {/* Badge */}
        {/* 
        <span className="mb-6 rounded-full border border-warm-white/30 bg-warm-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-warm-white backdrop-blur-md">
          AI-Powered Travel Planning
        </span>
        */}

        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-warm-white [text-shadow:0_4px_20px_rgba(0,0,0,0.65)] sm:text-7xl text-balance">
          Your journey, planned by AI
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-warm-white/80">
          Create personalized travel itineraries in seconds. Discover hidden
          gems, optimize your route, and let AI build the perfect trip for your
          budget and travel style.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          {/* Primary Button */}
          <Link
            to="/signup"
            className="rounded-full bg-terracotta px-8 py-3.5 text-sm font-semibold text-warm-white shadow-lg shadow-terracotta/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            Get Started Free
          </Link>

          {/* Secondary Button */}
          <a
            href="#how-it-works"
            className="rounded-full border border-warm-white/60 bg-charcoal/50 px-8 py-3.5 text-sm font-semibold text-warm-white backdrop-blur-md transition-all duration-300 hover:border-warm-white hover:bg-charcoal/70"
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;