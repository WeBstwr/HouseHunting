const toLocationValue = (value) => typeof value === 'string' ? value.trim() : ''

export const createPropertyLocation = ({ estate = '', town = '', county = '' }) => (
  [estate, town, county].map(toLocationValue).filter(Boolean).join(', ')
)

export const getPropertyLocationFields = (property) => {
  const structuredLocation = {
    county: toLocationValue(property.county),
    town: toLocationValue(property.town),
    estate: toLocationValue(property.estate),
  }

  if (structuredLocation.county || structuredLocation.town || structuredLocation.estate) return structuredLocation

  const locationParts = toLocationValue(property.location)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (locationParts.length === 1) return { county: locationParts[0], town: '', estate: '' }
  if (locationParts.length === 2) return { county: locationParts[1], town: locationParts[0], estate: '' }

  return {
    county: locationParts.at(-1) || '',
    town: locationParts.at(-2) || '',
    estate: locationParts.slice(0, -2).join(', '),
  }
}

export const getPropertyLocationSearchText = (property) => (
  [property.location, property.county, property.town, property.estate]
    .map(toLocationValue)
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
)
