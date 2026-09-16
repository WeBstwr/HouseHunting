import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../../components/FilterBar/FilterBar'
import PropertyCard from '../../components/PropertyCard/PropertyCard'
import { houseTypes, listingAmenities } from '../../data/listingData'
import useFilterStore, { defaultListingFilters } from '../../store/filterStore'
import useListingStore from '../../store/listingStore'
import './listings.css'

const filtersFromSearchParams = (searchParams) => ({
  ...defaultListingFilters,
  location: searchParams.get('location') || '',
  type: searchParams.get('type') || '',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || searchParams.get('price') || '',
  bedrooms: searchParams.get('bedrooms') || '',
  amenity: searchParams.get('amenity') || '',
  sort: searchParams.get('sort') || 'newest',
})

const searchParamsFromFilters = (filters) => {
  const searchParams = new URLSearchParams()
  if (filters.location) searchParams.set('location', filters.location)
  if (filters.type) searchParams.set('type', filters.type)
  if (filters.minPrice) searchParams.set('minPrice', filters.minPrice)
  if (filters.maxPrice) searchParams.set('maxPrice', filters.maxPrice)
  if (filters.bedrooms) searchParams.set('bedrooms', filters.bedrooms)
  if (filters.amenity) searchParams.set('amenity', filters.amenity)
  if (filters.sort !== 'newest') searchParams.set('sort', filters.sort)
  return searchParams
}

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const properties = useListingStore((state) => state.properties)
  const filters = useFilterStore((state) => state.filters)
  const setFilters = useFilterStore((state) => state.setFilters)
  const updateFilter = useFilterStore((state) => state.updateFilter)
  const resetFilters = useFilterStore((state) => state.resetFilters)

  useEffect(() => {
    setFilters(filtersFromSearchParams(searchParams))
  }, [searchParams, setFilters])

  const matchingProperties = useMemo(() => {
    const minimumPrice = Number(filters.minPrice) || 0
    const maximumPrice = Number(filters.maxPrice) || Number.POSITIVE_INFINITY
    const location = filters.location.trim().toLowerCase()

    const results = properties.filter((property) => (
      (!location || property.location.toLowerCase().includes(location))
      && (!filters.type || property.typeKey === filters.type)
      && property.price >= minimumPrice
      && property.price <= maximumPrice
      && (!filters.bedrooms || property.bedroomCount === Number(filters.bedrooms))
      && (!filters.amenity || property.amenities.includes(filters.amenity))
    ))

    return [...results].sort((first, second) => {
      if (filters.sort === 'price-low') return first.price - second.price
      if (filters.sort === 'price-high') return second.price - first.price
      return new Date(second.createdAt) - new Date(first.createdAt)
    })
  }, [filters, properties])

  const handleFilterChange = (event) => {
    const nextFilters = { ...filters, [event.target.name]: event.target.value }
    updateFilter(event.target.name, event.target.value)
    setSearchParams(searchParamsFromFilters(nextFilters), { replace: true })
  }

  const handleResetFilters = () => {
    resetFilters()
    setSearchParams(new URLSearchParams(), { replace: true })
  }
  const resultLabel = `${matchingProperties.length} ${matchingProperties.length === 1 ? 'home' : 'homes'} found`

  return (
    <main className="listings-page">
      <section className="listings-page__hero" aria-labelledby="listings-title">
        <div className="container">
          <p className="listings-page__eyebrow">Available rentals</p>
          <h1 id="listings-title">Find your next home</h1>
          <p>Explore rental spaces by location, home type, budget, and the features that matter to you.</p>
        </div>
      </section>

      <section className="listings-page__content">
        <div className="container">
          <FilterBar
            filters={filters}
            houseTypes={houseTypes}
            amenities={listingAmenities}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <div className="listings-page__controls" aria-live="polite">
            <p>{resultLabel}</p>
            <label className="listings-page__sort" htmlFor="listing-sort">
              <span>Sort by</span>
              <select id="listing-sort" name="sort" value={filters.sort} onChange={handleFilterChange}>
                <option value="newest">Newest</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>

          {matchingProperties.length > 0 ? (
            <div className="listings-page__grid">
              {matchingProperties.map((property) => <PropertyCard key={property.id} property={property} />)}
            </div>
          ) : (
            <section className="listings-page__empty" aria-labelledby="empty-results-title">
              <p className="listings-page__eyebrow">No exact match yet</p>
              <h2 id="empty-results-title">Try widening your search</h2>
              <p>There are no homes matching these filters right now. Clear a filter or adjust your budget to see more options.</p>
              <button type="button" onClick={handleResetFilters}>Clear all filters</button>
            </section>
          )}
        </div>
      </section>
    </main>
  )
}

export default Listings
