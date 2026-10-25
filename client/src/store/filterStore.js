import { create } from 'zustand'

export const defaultListingFilters = {
  keyword: '',
  location: '',
  type: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
  amenities: [],
  availability: '',
  sort: 'newest',
}

const useFilterStore = create((set) => ({
  filters: defaultListingFilters,
  setFilters: (filters) => set({ filters: { ...defaultListingFilters, ...filters, amenities: Array.isArray(filters.amenities) ? filters.amenities : [] } }),
  updateFilter: (name, value) => set((state) => ({ filters: { ...state.filters, [name]: value } })),
  resetFilters: () => set({ filters: defaultListingFilters }),
}))

export default useFilterStore
