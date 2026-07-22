// Safely parses a fetch Response as JSON, even when the server (or a proxy in front of
// it, e.g. Vercel's gateway on a timeout) returns an HTML error page instead of JSON.
export async function parseApiResponse(response) {
  let payload
  try {
    payload = await response.json()
  } catch {
    if (response.status === 504) {
      throw new Error('The server took too long to respond (gateway timeout). Please try again.')
    }
    throw new Error(`Unexpected server response (status ${response.status}). Please try again.`)
  }

  if (!response.ok) {
    throw new Error(payload.error || 'Something went wrong.')
  }

  return payload
}
