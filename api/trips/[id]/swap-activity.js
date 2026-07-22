import { createClient } from '@supabase/supabase-js'
import { generateSwapAlternatives } from '../../_lib/ai.js'

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

  const tripId = req.query.id
  const { day, activityIndex } = req.body || {}
  if (!tripId || typeof day !== 'number' || typeof activityIndex !== 'number') {
    res.status(400).json({ error: 'Missing day or activityIndex' })
    return
  }

  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single()

  if (tripError || !trip) {
    res.status(404).json({ error: 'Trip not found' })
    return
  }

  const dayEntry = trip.itinerary?.days?.find((d) => d.day === day)
  const targetActivity = dayEntry?.activities?.[activityIndex]
  if (!dayEntry || !targetActivity) {
    res.status(400).json({ error: 'Activity not found' })
    return
  }

  try {
    const alternatives = await generateSwapAlternatives({
      destination: trip.destination,
      interests: trip.interests,
      travelStyle: trip.travel_style,
      budget: trip.budget,
      day,
      targetActivity,
      existingActivities: dayEntry.activities,
    })
    res.status(200).json({ alternatives })
  } catch (err) {
    res.status(502).json({ error: `AI generation failed: ${err.message}` })
  }
}
