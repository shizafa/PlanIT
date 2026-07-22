import { createClient } from '@supabase/supabase-js'

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

  // Verify identity with the anon-key client first — never trust a client-supplied user id.
  const anonClient = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
  const { data: userData, error: userError } = await anonClient.auth.getUser(accessToken)
  if (userError || !userData?.user) {
    res.status(401).json({ error: 'Invalid or expired session' })
    return
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server.' })
    return
  }

  // Deleting a user requires admin privileges — this is the one place in the app
  // that uses the service-role key, and only to delete the already-verified caller.
  const adminClient = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userData.user.id)

  if (deleteError) {
    res.status(500).json({ error: deleteError.message })
    return
  }

  res.status(200).json({ success: true })
}
