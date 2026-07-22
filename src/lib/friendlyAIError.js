export function friendlyAIError(message) {
  if (message.includes('429') || message.toLowerCase().includes('rate limit')) {
    return "PlanIT's free AI quota has been used up for now (OpenRouter's free tier has daily and per-minute limits). Please try again in a bit."
  }
  if (message.includes('503') || message.toLowerCase().includes('unavailable')) {
    return 'The AI model is briefly unavailable right now. Wait a few seconds and try again.'
  }
  return message
}
