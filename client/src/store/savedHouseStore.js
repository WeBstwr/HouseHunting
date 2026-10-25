import { create } from 'zustand'

const useSavedHouseStore = create((set) => ({
  savedPropertyIdsByTenant: {},
  toggleSavedProperty: (tenantId, propertyId) => {
    if (!tenantId || !propertyId) return

    set((state) => {
      const savedPropertyIds = state.savedPropertyIdsByTenant[tenantId] || []
      const nextSavedPropertyIds = savedPropertyIds.includes(propertyId)
        ? savedPropertyIds.filter((id) => id !== propertyId)
        : [...savedPropertyIds, propertyId]

      return {
        savedPropertyIdsByTenant: {
          ...state.savedPropertyIdsByTenant,
          [tenantId]: nextSavedPropertyIds,
        },
      }
    })
  },
  clearSavedProperties: (tenantId) => {
    if (!tenantId) return
    set((state) => ({
      savedPropertyIdsByTenant: {
        ...state.savedPropertyIdsByTenant,
        [tenantId]: [],
      },
    }))
  },
}))

export default useSavedHouseStore
