import { create } from 'zustand'
import { listingProperties } from '../data/listingData'

const useListingStore = create((set) => ({
  properties: listingProperties,
  setProperties: (properties) => set({ properties }),
  addProperty: (property) => set((state) => ({ properties: [property, ...state.properties] })),
  updateProperty: (propertyId, updates) => {
    let updated = false
    const { id, ownerId, managedByAgentIds, ...editableUpdates } = updates

    set((state) => ({
      properties: state.properties.map((property) => {
        if (property.id !== propertyId) return property
        updated = true
        return { ...property, ...editableUpdates }
      }),
    }))

    return updated
  },
}))

export default useListingStore
