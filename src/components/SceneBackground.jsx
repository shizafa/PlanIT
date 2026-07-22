function SceneBackground({ tone = 'day' }) {
  if (tone === 'night') {
    return (
      <svg
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="scene-sky-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2C2420" />
            <stop offset="100%" stopColor="#2D5A3D" />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#scene-sky-night)" />
        <circle cx="1260" cy="170" r="120" fill="#D4A574" opacity="0.22" />
        <polygon
          points="0,900 0,620 260,420 520,660 780,380 1040,640 1300,440 1600,620 1600,900"
          fill="#FAF8F5"
          opacity="0.05"
        />
        <polygon
          points="0,900 0,700 320,520 640,720 960,500 1280,720 1600,560 1600,900"
          fill="#FAF8F5"
          opacity="0.08"
        />
      </svg>
    )
  }

  return (
    <>
      <video
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
        src="/videos/hero-bg.webm"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-charcoal/20" />
    </>
  )
}

export default SceneBackground