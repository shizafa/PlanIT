import { Link } from 'react-router-dom'

const features = [
  'AI-crafted itineraries in seconds',
  'Built around your budget & pace',
  'Swap any activity instantly',
]

function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-forest/50 backdrop-blur-2xl lg:flex lg:w-1/2">
      <div className="relative z-10 flex flex-col justify-center px-14 py-16 text-warm-white">
        <Link to="/" className="font-display text-2xl">
          PlanIT
        </Link>
        <h2 className="mt-8 max-w-sm font-display text-3xl leading-snug">
          Plans built around what you love.
        </h2>
        <p className="mt-4 max-w-sm text-warm-white/75">
          Tell us a few details about your trip and get a personalized itinerary in seconds —
          easy to refine until it's exactly right.
        </p>
        <ul className="mt-10 space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-warm-white/90">
              <span className="text-sand">—</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BrandPanel