import { create } from 'zustand'
import { listingProperties } from '../data/listingData'

const useListingStore = create((set) => ({
  properties: listingProperties,
  setProperties: (properties) => set({ properties }),
}))

export default useListingStore
