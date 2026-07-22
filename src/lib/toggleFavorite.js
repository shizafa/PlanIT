import { supabase } from './supabaseClient.js'

export async function toggleFavorite(trip) {
  const { data, error } = await supabase
    .from('trips')
    .update({ is_favorite: !trip.is_favorite })
    .eq('id', trip.id)
    .select()
    .single()

  if (error) throw error
  return data
}
