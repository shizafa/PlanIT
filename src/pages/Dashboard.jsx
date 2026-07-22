import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext.jsx'
import { useTripStore } from '../store/tripStore.js'
import { supabase } from '../lib/supabaseClient.js'
import { toggleFavorite } from '../lib/toggleFavorite.js'
import TripCard from '../components/TripCard.jsx'
import { SuitcaseIcon, CalendarIcon, MapPinIcon, SparkleIcon, CompassIcon } from '../components/icons.jsx'

function daysBetween(start, end) {
  const ms = new Date(end) - new Date(start)
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1
}

function StatTile({ label, value, icon: Icon, className = '' }) {
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border border-warm-white/15 bg-warm-white/10 p-6 backdrop-blur-xl ${className}`}
    >
      <Icon className="h-5 w-5 text-sand" />
      <div>
        <p className="font-display text-3xl text-warm-white">{value}</p>
        <p className="mt-1 text-sm text-warm-white/60">{label}</p>
      </div>
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const draft = useTripStore((state) => state.draft)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

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

  const today = new Date().toISOString().slice(0, 10)
  const upcomingTrips = trips
    .filter((trip) => trip.start_date >= today)
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .slice(0, 3)
  const recentTrips = trips.slice(0, 3)

  const totalTrips = trips.length
  const totalDays = trips.reduce((sum, trip) => sum + daysBetween(trip.start_date, trip.end_date), 0)
  const destinationsCount = new Set(trips.map((trip) => trip.destination).filter(Boolean)).size

  const hasDraftInProgress = Boolean(
    draft.departureLocation || draft.destination || draft.interests.length > 0,
  )
  const firstName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'there'

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="break-words font-display text-2xl text-warm-white sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-warm-white/60">Here's where your trips stand.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-6 sm:auto-rows-[minmax(150px,auto)]">
        <StatTile label="Total trips" value={totalTrips} icon={SuitcaseIcon} className="sm:col-span-2" />
        <StatTile label="Days traveled" value={totalDays} icon={CalendarIcon} className="sm:col-span-2" />
        <StatTile
          label="Destinations explored"
          value={destinationsCount}
          icon={MapPinIcon}
          className="col-span-2 sm:col-span-2"
        />

        <section className="col-span-2 rounded-2xl border border-warm-white/15 bg-warm-white/10 p-6 backdrop-blur-xl sm:col-span-4 sm:row-span-2">
          <h2 className="font-display text-lg text-warm-white">Upcoming trips</h2>
          {loading ? (
            <p className="mt-4 text-sm text-warm-white/60">Loading…</p>
          ) : upcomingTrips.length === 0 ? (
            <p className="mt-4 text-sm text-warm-white/60">No upcoming trips yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {upcomingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onToggleFavorite={handleToggleFavorite} />
              ))}
            </div>
          )}
        </section>

        <Link
          to="/planner"
          className="col-span-2 flex flex-col justify-between rounded-2xl bg-terracotta p-6 text-warm-white shadow-lg shadow-terracotta/30 transition-transform hover:-translate-y-0.5 sm:col-span-2"
        >
          <CompassIcon className="h-6 w-6" />
          <div>
            <p className="font-display text-lg">{hasDraftInProgress ? 'Continue planning' : 'Plan a new trip'}</p>
            <p className="mt-1 text-sm text-warm-white/80">Tell PlanIT where you want to go.</p>
          </div>
        </Link>

        <section className="col-span-2 rounded-2xl border border-warm-white/15 bg-warm-white/10 p-6 backdrop-blur-xl sm:col-span-2">
          <div className="flex items-center gap-2">
            <SparkleIcon className="h-4 w-4 text-sand" />
            <h2 className="font-display text-lg text-warm-white">AI suggestions</h2>
          </div>
          <p className="mt-2 text-sm text-warm-white/60">Personalized ideas based on your travel history — coming soon.</p>
        </section>

        <section className="col-span-2 rounded-2xl border border-warm-white/15 bg-warm-white/10 p-6 backdrop-blur-xl sm:col-span-6">
          <h2 className="font-display text-lg text-warm-white">Recent trips</h2>
          {loading ? (
            <p className="mt-4 text-sm text-warm-white/60">Loading…</p>
          ) : recentTrips.length === 0 ? (
            <p className="mt-4 text-sm text-warm-white/60">You haven't planned a trip yet.</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {recentTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onToggleFavorite={handleToggleFavorite} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Dashboard
