const points = [
  'Personalized to your budget and interests',
  'Editable, not fixed — swap any activity instantly',
  'Every trip saved to your dashboard',
]

function AboutUs() {
  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 sm:grid-cols-2 sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-forest">
            About Us
          </span>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">
            Planning a trip shouldn't feel like a second job
          </h2>
          <p className="mt-5 leading-relaxed text-warm-gray">
            PlanIT started with a simple frustration: hours lost across dozens of tabs trying to
            piece together a trip that actually fits your budget and your taste. We built an AI
            travel assistant that does the heavy lifting, so you spend less time planning and
            more time looking forward to the trip itself.
          </p>
        </div>

        <div className="rounded-2xl border border-warm-white/50 bg-warm-white/30 p-8 shadow-lg shadow-charcoal/5 backdrop-blur-xl">
          <ul className="space-y-5">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-charcoal">
                <span className="text-terracotta">—</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
