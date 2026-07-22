import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { toggleFavorite } from '../lib/toggleFavorite.js'
import TripCard from '../components/TripCard.jsx'

function MyTrips() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const query = searchParams.get('q') || ''

  useEffect(() => {
    let cancelled = false

    async function loadTrips() {
      setLoading(true)
      const { data } = await supabase.from('trips').select('*').order('created_at', { ascending: false })
      if (!cancelled) {
        setTrips(data || [])
        setLoading(false)
      }
    }

    loadTrips()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleToggleFavorite(trip) {
    try {
      const updated = await toggleFavorite(trip)
      setTrips((current) => current.map((t) => (t.id === updated.id ? updated : t)))
    } catch (err) {
      console.error(err)
    }
  }

  const filteredTrips = query
    ? trips.filter((trip) => trip.destination?.toLowerCase().includes(query.toLowerCase()))
    : trips

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-warm-white">My trips</h1>
        <Link
          to="/planner"
          className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-warm-white shadow-md shadow-terracotta/30 transition-transform hover:-translate-y-0.5"
        >
          Plan a new trip
        </Link>
      </div>

      <input
        type="search"
        placeholder="Filter by destination…"
        value={query}
        onChange={(event) => setSearchParams(event.target.value ? { q: event.target.value } : {})}
        className="mt-6 w-full max-w-sm rounded-full border border-warm-white/15 bg-warm-white/10 px-4 py-2 text-sm text-warm-white placeholder:text-warm-white/40 focus:border-terracotta/50 focus:outline-none"
      />

      {loading ? (
        <p className="mt-8 text-warm-white/60">Loading…</p>
      ) : filteredTrips.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-warm-white/15 bg-warm-white/10 p-10 text-center backdrop-blur-xl">
          <p className="text-warm-white">
            {query ? 'No trips match that search.' : "You haven't planned a trip yet."}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyTrips
