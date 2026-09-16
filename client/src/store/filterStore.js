import { create } from 'zustand'

export const defaultListingFilters = {
  location: '',
  type: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
  amenity: '',
  sort: 'newest',
}

const useFilterStore = create((set) => ({
  filters: defaultListingFilters,
  setFilters: (filters) => set({ filters: { ...defaultListingFilters, ...filters } }),
  updateFilter: (name, value) => set((state) => ({ filters: { ...state.filters, [name]: value } })),
  resetFilters: () => set({ filters: defaultListingFilters }),
}))

export default useFilterStore
