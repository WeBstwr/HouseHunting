import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../../components/FilterBar/FilterBar'
import PropertyCard from '../../components/PropertyCard/PropertyCard'
import { houseTypes, listingAmenities } from '../../data/listingData'
import useFilterStore, { defaultListingFilters } from '../../store/filterStore'
import useListingStore from '../../store/listingStore'
import { getPropertyLocationSearchText } from '../../utils/propertyLocation'
import './listings.css'

const supportedBedroomFilters = new Set(['0', '1', '2', '3', '4+'])
const supportedSorts = new Set(['newest', 'price-low', 'price-high'])

const normalisePriceFilter = (value) => {
  if (!value?.trim()) return ''
  const price = Number(value)
  return Number.isFinite(price) && price >= 0 ? String(price) : ''
}

const filtersFromSearchParams = (searchParams, availabilityOptions) => {
  const selectedAmenities = [...new Set(searchParams.getAll('amenity').filter((amenity) => listingAmenities.includes(amenity)))]
  const type = searchParams.get('type') || ''
  const bedrooms = searchParams.get('bedrooms') || ''
  const availability = searchParams.get('availability') || ''
  const sort = searchParams.get('sort') || 'newest'

  return {
    ...defaultListingFilters,
    keyword: searchParams.get('keyword')?.trim() || '',
    location: searchParams.get('location')?.trim() || '',
    type: houseTypes.some((houseType) => houseType.query === type) ? type : '',
    minPrice: normalisePriceFilter(searchParams.get('minPrice')),
    maxPrice: normalisePriceFilter(searchParams.get('maxPrice') || searchParams.get('price')),
    bedrooms: supportedBedroomFilters.has(bedrooms) ? bedrooms : '',
    amenities: selectedAmenities,
    availability: availabilityOptions.includes(availability) ? availability : '',
    sort: supportedSorts.has(sort) ? sort : 'newest',
  }
}

const searchParamsFromFilters = (filters) => {
  const searchParams = new URLSearchParams()
  if (filters.keyword.trim()) searchParams.set('keyword', filters.keyword.trim())
  if (filters.location.trim()) searchParams.set('location', filters.location.trim())
  if (filters.type) searchParams.set('type', filters.type)
  if (filters.minPrice) searchParams.set('minPrice', filters.minPrice)
  if (filters.maxPrice) searchParams.set('maxPrice', filters.maxPrice)
  if (filters.bedrooms) searchParams.set('bedrooms', filters.bedrooms)
  filters.amenities.forEach((amenity) => searchParams.append('amenity', amenity))
  if (filters.availability) searchParams.set('availability', filters.availability)
  if (filters.sort !== 'newest') searchParams.set('sort', filters.sort)
  return searchParams
}

const getBedroomCount = (property) => {
  if (Number.isFinite(property.bedroomCount)) return property.bedroomCount
  if (typeof property.bedrooms !== 'string') return undefined
  if (property.bedrooms.trim().toLowerCase() === 'studio') return 0

  const bedroomMatch = property.bedrooms.match(/\d+/)
  return bedroomMatch ? Number(bedroomMatch[0]) : undefined
}

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const properties = useListingStore((state) => state.properties)
  const filters = useFilterStore((state) => state.filters)
  const setFilters = useFilterStore((state) => state.setFilters)
  const updateFilter = useFilterStore((state) => state.updateFilter)
  const resetFilters = useFilterStore((state) => state.resetFilters)
  const availabilityOptions = useMemo(
    () => [...new Set(properties.map((property) => property.availability).filter(Boolean))],
    [properties],
  )

  useEffect(() => {
    setFilters(filtersFromSearchParams(searchParams, availabilityOptions))
  }, [availabilityOptions, searchParams, setFilters])

  const matchingProperties = useMemo(() => {
    const minimumPrice = Number(filters.minPrice) || 0
    const maximumPrice = Number(filters.maxPrice) || Number.POSITIVE_INFINITY
    const keyword = filters.keyword.trim().toLowerCase()
    const location = filters.location.trim().toLowerCase()

    const results = properties.filter((property) => {
      const locationText = getPropertyLocationSearchText(property)
      const keywordText = [property.title, property.description, locationText].filter(Boolean).join(' ').toLowerCase()
      const price = Number(property.price)
      const bedroomCount = getBedroomCount(property)
      const propertyAmenities = Array.isArray(property.amenities) ? property.amenities : []
      const matchesBedrooms = !filters.bedrooms
        || filters.bedrooms === '4+' && bedroomCount >= 4
        || filters.bedrooms !== '4+' && bedroomCount === Number(filters.bedrooms)

      return (
        (!keyword || keywordText.includes(keyword))
        && (!location || locationText.includes(location))
        && (!filters.type || property.typeKey === filters.type)
        && Number.isFinite(price) && price >= minimumPrice && price <= maximumPrice
        && matchesBedrooms
        && filters.amenities.every((amenity) => propertyAmenities.includes(amenity))
        && (!filters.availability || property.availability === filters.availability)
      )
    })

    return [...results].sort((first, second) => {
      if (filters.sort === 'price-low') return first.price - second.price
      if (filters.sort === 'price-high') return second.price - first.price
      return (Date.parse(second.createdAt) || 0) - (Date.parse(first.createdAt) || 0)
    })
  }, [filters, properties])

  const updateUrlFilters = (nextFilters) => {
    setFilters(nextFilters)
    setSearchParams(searchParamsFromFilters(nextFilters), { replace: true })
  }

  const handleFilterChange = (event) => {
    const nextFilters = { ...filters, [event.target.name]: event.target.value }
    updateFilter(event.target.name, event.target.value)
    setSearchParams(searchParamsFromFilters(nextFilters), { replace: true })
  }

  const handleAmenityToggle = (amenity) => {
    const amenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((item) => item !== amenity)
      : [...filters.amenities, amenity]
    updateUrlFilters({ ...filters, amenities })
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
            availabilityOptions={availabilityOptions}
            onAmenityToggle={handleAmenityToggle}
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
