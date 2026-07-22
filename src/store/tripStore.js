import { create } from 'zustand'

const INITIAL_DRAFT = {
  departureLocation: '',
  destination: '',
  startDate: '',
  endDate: '',
  budget: '',
  numberOfTravelers: '',
  travelStyle: 'adventure',
  interests: [],
  preferredSeason: 'any',
  additionalInfo: '',
}

export const useTripStore = create((set) => ({
  draft: INITIAL_DRAFT,

  setDraftField: (field, value) =>
    set((state) => ({ draft: { ...state.draft, [field]: value } })),

  toggleInterest: (interest) =>
    set((state) => {
      const interests = state.draft.interests.includes(interest)
        ? state.draft.interests.filter((item) => item !== interest)
        : [...state.draft.interests, interest]
      return { draft: { ...state.draft, interests } }
    }),

  resetDraft: () => set({ draft: INITIAL_DRAFT }),
}))
