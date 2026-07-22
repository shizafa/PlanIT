import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTripStore } from '../store/tripStore.js'
import { useAuth } from '../lib/AuthContext.jsx'
import { friendlyAIError } from '../lib/friendlyAIError.js'
import { parseApiResponse } from '../lib/parseApiResponse.js'
import PillGroup from '../components/PillGroup.jsx'
import AILoadingMessage from '../components/AILoadingMessage.jsx'

const TRAVEL_STYLE_OPTIONS = [
  { value: 'luxury', label: 'Luxury' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'solo', label: 'Solo' },
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family' },
  { value: 'backpacking', label: 'Backpacking' },
]

const INTEREST_OPTIONS = [
  { value: 'nature', label: 'Nature' },
  { value: 'beaches', label: 'Beaches' },
  { value: 'mountains', label: 'Mountains' },
  { value: 'food', label: 'Food' },
  { value: 'photography', label: 'Photography' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'history', label: 'History' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'nightlife', label: 'Nightlife' },
]

const SEASON_OPTIONS = [
  { value: 'any', label: 'No preference' },
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
  { value: 'winter', label: 'Winter' },
]

function Planner() {
  const draft = useTripStore((state) => state.draft)
  const setDraftField = useTripStore((state) => state.setDraftField)
  const toggleInterest = useTripStore((state) => state.toggleInterest)
  const resetDraft = useTripStore((state) => state.resetDraft)
  const { session } = useAuth()
  const navigate = useNavigate()

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function validate() {
    const nextErrors = {}
    if (!draft.departureLocation.trim()) nextErrors.departureLocation = 'Enter a departure location.'
    if (!draft.startDate) nextErrors.startDate = 'Pick a start date.'
    if (!draft.endDate) nextErrors.endDate = 'Pick an end date.'
    if (draft.startDate && draft.endDate && draft.endDate < draft.startDate) {
      nextErrors.endDate = 'End date must be after the start date.'
    }
    if (!draft.budget || Number(draft.budget) <= 0) {
      nextErrors.budget = 'Enter a budget greater than 0.'
    }
    if (!draft.numberOfTravelers || Number(draft.numberOfTravelers) <= 0) {
      nextErrors.numberOfTravelers = 'Enter at least 1 traveler.'
    }
    if (!draft.travelStyle) {
      nextErrors.travelStyle = 'Pick a travel style.'
    }
    if (draft.interests.length === 0) {
      nextErrors.interests = 'Pick at least one interest.'
    }
    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitError('')
    setSubmitting(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(draft),
      })
      const payload = await parseApiResponse(response)
      resetDraft()
      navigate(`/trip/${payload.trip.id}`)
    } catch (err) {
      setSubmitError(friendlyAIError(err.message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl text-warm-white">Plan your trip</h1>
      <p className="mt-2 text-warm-white/70">
        Tell PlanIT the basics and we'll put together a day-by-day itinerary.
      </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-8 rounded-2xl border border-warm-white/15 bg-warm-white/10 p-8 shadow-xl backdrop-blur-xl"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="departureLocation" className="text-sm font-medium text-warm-white">
                Departure location
              </label>
              <input
                id="departureLocation"
                type="text"
                placeholder="e.g. Chicago, USA"
                value={draft.departureLocation}
                onChange={(event) => setDraftField('departureLocation', event.target.value)}
                className="mt-1 w-full rounded-lg border border-charcoal/15 bg-warm-white px-4 py-2.5 text-charcoal focus:border-forest focus:outline-none"
              />
              {errors.departureLocation && (
                <p className="mt-1 text-sm text-terracotta">{errors.departureLocation}</p>
              )}
            </div>

            <div>
              <label htmlFor="destination" className="text-sm font-medium text-warm-white">
                Preferred destination <span className="text-warm-white/50">(optional)</span>
              </label>
              <input
                id="destination"
                type="text"
                placeholder="Leave blank and we'll suggest one"
                value={draft.destination}
                onChange={(event) => setDraftField('destination', event.target.value)}
                className="mt-1 w-full rounded-lg border border-charcoal/15 bg-warm-white px-4 py-2.5 text-charcoal focus:border-forest focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="startDate" className="text-sm font-medium text-warm-white">
                Start date
              </label>
              <input
                id="startDate"
                type="date"
                value={draft.startDate}
                onChange={(event) => setDraftField('startDate', event.target.value)}
                className="mt-1 w-full rounded-lg border border-charcoal/15 bg-warm-white px-4 py-2.5 text-charcoal focus:border-forest focus:outline-none"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-terracotta">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-medium text-warm-white">
                End date
              </label>
              <input
                id="endDate"
                type="date"
                value={draft.endDate}
                onChange={(event) => setDraftField('endDate', event.target.value)}
                className="mt-1 w-full rounded-lg border border-charcoal/15 bg-warm-white px-4 py-2.5 text-charcoal focus:border-forest focus:outline-none"
              />
              {errors.endDate && <p className="mt-1 text-sm text-terracotta">{errors.endDate}</p>}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="budget" className="text-sm font-medium text-warm-white">
                Budget (USD, total)
              </label>
              <input
                id="budget"
                type="number"
                min="0"
                placeholder="e.g. 2000"
                value={draft.budget}
                onChange={(event) => setDraftField('budget', event.target.value)}
                className="mt-1 w-full rounded-lg border border-charcoal/15 bg-warm-white px-4 py-2.5 text-charcoal focus:border-forest focus:outline-none"
              />
              {errors.budget && <p className="mt-1 text-sm text-terracotta">{errors.budget}</p>}
            </div>
            <div>
              <label htmlFor="numberOfTravelers" className="text-sm font-medium text-warm-white">
                Number of travelers
              </label>
              <input
                id="numberOfTravelers"
                type="number"
                min="1"
                placeholder="e.g. 2"
                value={draft.numberOfTravelers}
                onChange={(event) => setDraftField('numberOfTravelers', event.target.value)}
                className="mt-1 w-full rounded-lg border border-charcoal/15 bg-warm-white px-4 py-2.5 text-charcoal focus:border-forest focus:outline-none"
              />
              {errors.numberOfTravelers && (
                <p className="mt-1 text-sm text-terracotta">{errors.numberOfTravelers}</p>
              )}
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-warm-white">Travel style</span>
            <div className="mt-2">
              <PillGroup
                options={TRAVEL_STYLE_OPTIONS}
                value={draft.travelStyle}
                onChange={(value) => setDraftField('travelStyle', value)}
              />
            </div>
            {errors.travelStyle && <p className="mt-1 text-sm text-terracotta">{errors.travelStyle}</p>}
          </div>

          <div>
            <span className="text-sm font-medium text-warm-white">Interests</span>
            <div className="mt-2">
              <PillGroup
                options={INTEREST_OPTIONS}
                value={draft.interests}
                onChange={toggleInterest}
                multiple
              />
            </div>
            {errors.interests && <p className="mt-1 text-sm text-terracotta">{errors.interests}</p>}
          </div>

          <div>
            <span className="text-sm font-medium text-warm-white">Preferred season</span>
            <div className="mt-2">
              <PillGroup
                options={SEASON_OPTIONS}
                value={draft.preferredSeason}
                onChange={(value) => setDraftField('preferredSeason', value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="additionalInfo" className="text-sm font-medium text-warm-white">
              Additional notes
            </label>
            <textarea
              id="additionalInfo"
              rows={4}
              placeholder="e.g. traveling with a toddler, celebrating an anniversary, avoid long hikes, vegetarian food only…"
              value={draft.additionalInfo}
              onChange={(event) => setDraftField('additionalInfo', event.target.value)}
              className="mt-1 w-full resize-none rounded-lg border border-charcoal/15 bg-warm-white px-4 py-2.5 text-charcoal focus:border-forest focus:outline-none"
            />
            <p className="mt-1 text-xs text-warm-white/60">Optional — anything that helps us tailor the plan.</p>
          </div>

          {submitError && <p className="text-sm text-terracotta">{submitError}</p>}

          {submitting && (
            <AILoadingMessage className="justify-center text-sm text-warm-white/80" />
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-warm-white shadow-md shadow-terracotta/30 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {submitting ? 'Generating…' : 'Generate itinerary'}
          </button>
      </form>
    </div>
  )
}

export default Planner
