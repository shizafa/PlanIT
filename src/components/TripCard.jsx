import { Link } from 'react-router-dom'
import { HeartIcon } from './icons.jsx'

function TripCard({ trip, onToggleFavorite }) {
  function handleFavoriteClick(event) {
    event.preventDefault()
    event.stopPropagation()
    onToggleFavorite?.(trip)
  }

  return (
    <Link
      to={`/trip/${trip.id}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-warm-white/10 bg-warm-white/5 px-4 py-3 transition-colors hover:border-terracotta/40 hover:bg-warm-white/10"
    >
      <div>
        <p className="font-medium text-warm-white">{trip.destination || 'Destination TBD'}</p>
        <p className="text-sm text-warm-white/60">
          {trip.start_date} → {trip.end_date}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {trip.travel_style && (
          <span className="rounded-full bg-sand/20 px-3 py-1 text-xs font-semibold capitalize text-sand">
            {trip.travel_style}
          </span>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={trip.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="text-warm-white/50 transition-colors hover:text-terracotta"
          >
            <HeartIcon
              className="h-5 w-5"
              fill={trip.is_favorite ? '#C65D3B' : 'none'}
              stroke={trip.is_favorite ? '#C65D3B' : 'currentColor'}
            />
          </button>
        )}
      </div>
    </Link>
  )
}

export default TripCard
