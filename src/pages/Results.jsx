import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../lib/AuthContext.jsx'
import { friendlyAIError } from '../lib/friendlyAIError.js'
import { parseApiResponse } from '../lib/parseApiResponse.js'
import { toggleFavorite } from '../lib/toggleFavorite.js'
import DayTabs from '../components/DayTabs.jsx'
import TimelineItem from '../components/TimelineItem.jsx'
import { HeartIcon } from '../components/icons.jsx'

function Results() {
  const { id } = useParams()
  const { session } = useAuth()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeDay, setActiveDay] = useState(1)
  const [expandedIndex, setExpandedIndex] = useState(null)

  const [alternatives, setAlternatives] = useState([])
  const [swapLoading, setSwapLoading] = useState(false)
  const [swapError, setSwapError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadTrip() {
      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single()

      if (cancelled) return
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setTrip(data)
        setActiveDay(data.itinerary?.days?.[0]?.day ?? 1)
      }
      setLoading(false)
    }

    loadTrip()
    return () => {
      cancelled = true
    }
  }, [id])

  async function handleToggleActivity(activityIndex) {
    if (expandedIndex === activityIndex) {
      setExpandedIndex(null)
      return
    }

    setExpandedIndex(activityIndex)
    setAlternatives([])
    setSwapError('')
    setSwapLoading(true)

    try {
      const response = await fetch(`/api/trips/${id}/swap-activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ day: activeDay, activityIndex }),
      })
      const payload = await parseApiResponse(response)
      setAlternatives(payload.alternatives)
    } catch (err) {
      setSwapError(friendlyAIError(err.message))
    } finally {
      setSwapLoading(false)
    }
  }

  async function handleSelectAlternative(alternative) {
    const updatedItinerary = {
      ...trip.itinerary,
      days: trip.itinerary.days.map((d) =>
        d.day === activeDay
          ? { ...d, activities: d.activities.map((a, i) => (i === expandedIndex ? alternative : a)) }
          : d,
      ),
    }

    const { error: updateError } = await supabase
      .from('trips')
      .update({ itinerary: updatedItinerary })
      .eq('id', id)

    if (updateError) {
      setSwapError(updateError.message)
      return
    }

    setTrip({ ...trip, itinerary: updatedItinerary })
    setExpandedIndex(null)
  }

  async function handleToggleFavorite() {
    try {
      const updated = await toggleFavorite(trip)
      setTrip(updated)
    } catch (err) {
      console.error(err)
    }
  }

  const currentDay = trip?.itinerary?.days?.find((d) => d.day === activeDay)

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/videos/dashboard-bg.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-charcoal/70 via-charcoal/55 to-charcoal/75" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-10">
        <header className="flex items-center justify-between rounded-full border border-warm-white/15 bg-warm-white/10 px-6 py-3 backdrop-blur-xl">
          <Link to="/dashboard" className="font-display text-lg text-warm-white">
            PlanIT
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-warm-white/70 hover:text-terracotta"
          >
            Back to dashboard
          </Link>
        </header>

        {loading && (
          <div className="mt-12 rounded-2xl border border-warm-white/15 bg-warm-white/10 p-10 text-center text-warm-white/70 backdrop-blur-xl">
            Loading your itinerary…
          </div>
        )}

        {!loading && error && (
          <div className="mt-12 rounded-2xl border border-warm-white/15 bg-warm-white/10 p-10 text-center backdrop-blur-xl">
            <p className="text-warm-white">Couldn't load this trip.</p>
            <p className="mt-1 text-sm text-terracotta">{error}</p>
          </div>
        )}

        {!loading && trip && currentDay && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-12"
            >
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl text-warm-white">{trip.destination}</h1>
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  aria-label={trip.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                  className="text-warm-white/50 transition-colors hover:text-terracotta"
                >
                  <HeartIcon
                    className="h-6 w-6"
                    fill={trip.is_favorite ? '#C65D3B' : 'none'}
                    stroke={trip.is_favorite ? '#C65D3B' : 'currentColor'}
                  />
                </button>
              </div>
              <p className="mt-2 text-warm-white/70">
                {trip.start_date} → {trip.end_date} · ${trip.budget} budget ·{' '}
                {trip.number_of_travelers} traveler{trip.number_of_travelers === 1 ? '' : 's'} ·{' '}
                <span className="capitalize">{trip.travel_style}</span>
              </p>
              <p className="mt-1 text-sm text-warm-white/50">Click any activity to swap it for an alternative.</p>
            </motion.div>

            <DayTabs
              days={trip.itinerary.days}
              activeDay={activeDay}
              onSelect={(day) => {
                setActiveDay(day)
                setExpandedIndex(null)
              }}
              className="mt-8"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="mt-8"
              >
                {currentDay.activities.map((activity, index) => (
                  <TimelineItem
                    key={`${activity.time}-${activity.title}`}
                    activity={activity}
                    index={index}
                    isLast={index === currentDay.activities.length - 1}
                    expanded={expandedIndex === index}
                    onToggle={() => handleToggleActivity(index)}
                    alternatives={alternatives}
                    loading={expandedIndex === index && swapLoading}
                    error={expandedIndex === index ? swapError : ''}
                    onSelectAlternative={handleSelectAlternative}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}

export default Results