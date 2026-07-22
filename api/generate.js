import { createClient } from '@supabase/supabase-js'
import { generateItinerary } from './_lib/ai.js'

// Retries on AI provider rate limits can take a while — give this function room to finish on Vercel.
export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const authHeader = req.headers.authorization || ''
  const accessToken = authHeader.replace('Bearer ', '')
  if (!accessToken) {
    res.status(401).json({ error: 'Missing Authorization header' })
    return
  }

  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })

  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)
  if (userError || !userData?.user) {
    res.status(401).json({ error: 'Invalid or expired session' })
    return
  }

  const {
    departureLocation,
    destination,
    startDate,
    endDate,
    budget,
    numberOfTravelers,
    travelStyle,
    interests,
    preferredSeason,
    additionalInfo,
  } = req.body || {}

  if (
    !departureLocation ||
    !startDate ||
    !endDate ||
    !budget ||
    !numberOfTravelers ||
    !travelStyle ||
    !Array.isArray(interests) ||
    interests.length === 0
  ) {
    res.status(400).json({ error: 'Missing required trip fields' })
    return
  }

  let itinerary
  try {
    itinerary = await generateItinerary({
      departureLocation,
      destination,
      startDate,
      endDate,
      budget,
      numberOfTravelers,
      travelStyle,
      interests,
      preferredSeason,
      additionalInfo,
    })
  } catch (err) {
    res.status(502).json({ error: `AI generation failed: ${err.message}` })
    return
  }

  const { data: trip, error: insertError } = await supabase
    .from('trips')
    .insert({
      user_id: userData.user.id,
      departure_location: departureLocation,
      // Trust the itinerary's destination — it's authoritative whether the user specified
      // one (echoed back) or left it blank (AI picked one and reported it here).
      destination: itinerary.destination || destination || null,
      start_date: startDate,
      end_date: endDate,
      budget,
      number_of_travelers: numberOfTravelers,
      travel_style: travelStyle,
      interests,
      preferred_season: preferredSeason || null,
      additional_info: additionalInfo || null,
      itinerary,
    })
    .select()
    .single()

  if (insertError) {
    res.status(500).json({ error: `Failed to save trip: ${insertError.message}` })
    return
  }

  res.status(200).json({ trip })
}
