import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { toggleFavorite } from '../lib/toggleFavorite.js'
import TripCard from '../components/TripCard.jsx'

function Favorites() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadFavorites() {
      setLoading(true)
      const { data } = await supabase
        .from('trips')
        .select('*')
        .eq('is_favorite', true)
        .order('created_at', { ascending: false })
      if (!cancelled) {
        setTrips(data || [])
        setLoading(false)
      }
    }

    loadFavorites()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleToggleFavorite(trip) {
    try {
      const updated = await toggleFavorite(trip)
      setTrips((current) => current.filter((t) => t.id !== updated.id || updated.is_favorite))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl text-warm-white">Favorites</h1>
      <p className="mt-1 text-warm-white/60">Trips you've starred for quick access.</p>

      {loading ? (
        <p className="mt-8 text-warm-white/60">Loading…</p>
      ) : trips.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-warm-white/15 bg-warm-white/10 p-10 text-center backdrop-blur-xl">
          <p className="text-warm-white">No favorites yet.</p>
          <p className="mt-2 text-sm text-warm-white/60">
            Tap the heart on any trip in{' '}
            <Link to="/trips" className="text-terracotta hover:underline">
              My Trips
            </Link>{' '}
            to save it here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
