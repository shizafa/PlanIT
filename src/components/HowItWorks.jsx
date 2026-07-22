const steps = [
  {
    number: '01',
    title: 'Tell us your trip',
    description: "Destination, dates, budget, and the kind of travel style you're after.",
  },
  {
    number: '02',
    title: 'AI builds your itinerary',
    description:
      'A day-by-day plan tailored to your interests, pace, and group size — ready in seconds.',
  },
  {
    number: '03',
    title: 'Refine and go',
    description:
      "Not loving an activity? Swap it for an AI-suggested alternative until it feels right.",
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">How PlanIT works</h2>
          <p className="mt-4 text-warm-gray">From idea to itinerary in three simple steps.</p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-warm-white/50 bg-warm-white/30 p-8 text-left shadow-lg shadow-charcoal/5 backdrop-blur-xl"
            >
              <span className="font-display text-3xl text-sand">{step.number}</span>
              <h3 className="mt-4 text-lg font-semibold text-charcoal">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-warm-gray">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
