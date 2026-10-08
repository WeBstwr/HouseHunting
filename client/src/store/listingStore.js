import { create } from 'zustand'
import { listingProperties } from '../data/listingData'

const useListingStore = create((set) => ({
  properties: listingProperties,
  setProperties: (properties) => set({ properties }),
  addProperty: (property) => set((state) => ({ properties: [property, ...state.properties] })),
}))

export default useListingStore
