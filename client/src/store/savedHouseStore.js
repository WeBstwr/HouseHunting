import { create } from 'zustand'

const useSavedHouseStore = create((set) => ({
  savedPropertyIds: [],
  toggleSavedProperty: (propertyId) => set((state) => ({
    savedPropertyIds: state.savedPropertyIds.includes(propertyId)
      ? state.savedPropertyIds.filter((id) => id !== propertyId)
      : [...state.savedPropertyIds, propertyId],
  })),
}))

export default useSavedHouseStore
