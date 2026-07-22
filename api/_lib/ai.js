const OPENROUTER_MODEL = 'openai/gpt-oss-20b:free'
const MAX_ATTEMPTS = 4
const RETRY_DELAY_MS = 1500

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callAIJSON(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured on the server.')
  }

  const body = JSON.stringify({
    model: OPENROUTER_MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })

  let lastError
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://planit.app',
        'X-Title': 'PlanIT',
      },
      body,
    })

    if (!response.ok) {
      const errText = await response.text()
      lastError = new Error(`OpenRouter API error (${response.status}): ${errText}`)
      // Rate limits (429) and transient unavailability (503) are worth a retry.
      if ((response.status === 429 || response.status === 503) && attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_DELAY_MS * attempt)
        continue
      }
      throw lastError
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content
    if (!text) {
      throw new Error('AI returned no content.')
    }

    try {
      return JSON.parse(text)
    } catch {
      throw new Error('AI returned invalid JSON.')
    }
  }

  throw lastError
}

function buildItineraryPrompt({
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
}) {
  return `You are a travel-planning assistant. Build a day-by-day itinerary as strict JSON matching this schema:
{
  "destination": string,
  "days": [
    {
      "day": number,
      "date": "YYYY-MM-DD",
      "activities": [
        { "time": string, "title": string, "description": string, "estimatedCost": string }
      ]
    }
  ]
}

Trip details:
- Departing from: ${departureLocation}
- Destination: ${destination || 'not specified — choose the single best-fit destination yourself, reachable from the departure location, and put your choice in the "destination" field'}
- Dates: ${startDate} to ${endDate}
- Preferred season/timing context: ${preferredSeason && preferredSeason !== 'any' ? preferredSeason : 'no strong preference'}
- Total budget (USD): ${budget}
- Number of travelers: ${numberOfTravelers}
- Travel style: ${travelStyle}
- Interests: ${interests.join(', ') || 'none specified'}
- Additional notes: ${additionalInfo || 'none'}

Rules:
- If a destination was specified above, use exactly that destination in the "destination" field of your response.
- One entry in "days" per calendar day between the dates (inclusive).
- 3-5 activities per day. Match the travel style: backpacking/adventure = active and budget-conscious, luxury = higher-end venues, family = kid-friendly pacing, solo/couple = flexible.
- Keep total estimated costs roughly within the budget for ${numberOfTravelers || 1} traveler(s).
- estimatedCost should be a short string like "$12" or "Free".
- Respond with JSON only, no markdown fences, no commentary.`
}

export async function generateItinerary(tripInput) {
  return callAIJSON(buildItineraryPrompt(tripInput))
}

function buildSwapPrompt({ destination, interests, travelStyle, budget, day, targetActivity, existingActivities }) {
  const existingTitles = existingActivities
    .filter((activity) => activity.title !== targetActivity.title)
    .map((activity) => activity.title)
    .join(', ')

  return `You are a travel-planning assistant. A traveler wants to replace one activity in day ${day} of their ${destination} itinerary.

Activity being replaced:
- Time: ${targetActivity.time}
- Title: ${targetActivity.title}
- Description: ${targetActivity.description || 'none'}

Trip context:
- Interests: ${interests?.join(', ') || 'none specified'}
- Travel style: ${travelStyle || 'none specified'}
- Total trip budget (USD): ${budget}
- Other activities already planned that day (do not suggest these again): ${existingTitles || 'none'}

Suggest exactly 3 alternative activities for the SAME time slot (${targetActivity.time}) that fit the traveler's interests and travel style, and don't duplicate the other activities already planned that day. Respond with strict JSON only, no markdown fences, no commentary, matching this schema:
{
  "alternatives": [
    { "time": "${targetActivity.time}", "title": string, "description": string, "estimatedCost": string }
  ]
}`
}

export async function generateSwapAlternatives(input) {
  const result = await callAIJSON(buildSwapPrompt(input))
  return result.alternatives || []
}
