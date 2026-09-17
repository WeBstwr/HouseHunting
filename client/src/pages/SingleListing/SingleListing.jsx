import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PropertyCard from '../../components/PropertyCard/PropertyCard'
import PropertyGallery from '../../components/PropertyGallery/PropertyGallery'
import useListingStore from '../../store/listingStore'
import useSavedHouseStore from '../../store/savedHouseStore'
import './singlelisting.css'

const SingleListing = () => {
  const { id } = useParams()
  const properties = useListingStore((state) => state.properties)
  const savedPropertyIds = useSavedHouseStore((state) => state.savedPropertyIds)
  const toggleSavedProperty = useSavedHouseStore((state) => state.toggleSavedProperty)
  const [contactNotice, setContactNotice] = useState('')
  const property = properties.find((listing) => listing.id === id)

  useEffect(() => {
    setContactNotice('')
  }, [id])

  const relatedProperties = useMemo(() => {
    if (!property) return []
    const area = property.location.split(',').pop().trim()

    return properties
      .filter((listing) => listing.id !== property.id)
      .sort((first, second) => {
        const firstScore = (first.typeKey === property.typeKey ? 2 : 0) + (first.location.includes(area) ? 1 : 0)
        const secondScore = (second.typeKey === property.typeKey ? 2 : 0) + (second.location.includes(area) ? 1 : 0)
        return secondScore - firstScore || Math.abs(first.price - property.price) - Math.abs(second.price - property.price)
      })
      .slice(0, 3)
  }, [properties, property])

  if (!property) {
    return (
      <main className="single-listing single-listing--missing">
        <section className="container single-listing__missing" aria-labelledby="missing-property-title">
          <p className="single-listing__eyebrow">Property unavailable</p>
          <h1 id="missing-property-title">Property not found</h1>
          <p>This listing may no longer be available, or the link may be incorrect.</p>
          <Link className="single-listing__primary-link" to="/listings">Return to listings</Link>
        </section>
      </main>
    )
  }

  const isSaved = savedPropertyIds.includes(property.id)
  const description = property.description || `${property.title} is an available ${property.type.toLowerCase()} in ${property.location}. Review the property features, then arrange your next step when you are ready.`
  const listedDate = new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(property.createdAt))

  return (
    <main className="single-listing">
      <div className="container single-listing__breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/listings">Listings</Link>
        <span aria-hidden="true">/</span>
        <span>{property.title}</span>
      </div>

      <section className="container single-listing__top">
        <PropertyGallery property={property} />
        <aside className="single-listing__summary" aria-label="Property summary">
          <p className="single-listing__eyebrow">{property.availability}</p>
          <h1>{property.title}</h1>
          <p className="single-listing__location">{property.location}</p>
          <p className="single-listing__rent">{property.rent} <span>/ month</span></p>
          <div className="single-listing__key-details">
            <span>{property.type}</span>
            <span>{property.bedrooms}</span>
          </div>
          <div className="single-listing__actions">
            <button className="single-listing__save" type="button" onClick={() => toggleSavedProperty(property.id)} aria-pressed={isSaved}>
              {isSaved ? 'Saved house' : 'Save house'}
            </button>
            <button className="single-listing__contact" type="button" onClick={() => setContactNotice('Landlord contact will be available once the tenant contact flow is enabled.')}>Contact landlord</button>
          </div>
          {contactNotice && <p className="single-listing__contact-notice" role="status">{contactNotice}</p>}
        </aside>
      </section>

      <section className="container single-listing__body">
        <div className="single-listing__main-content">
          <section className="single-listing__section" aria-labelledby="about-property-title">
            <p className="single-listing__eyebrow">About this home</p>
            <h2 id="about-property-title">A place to settle into</h2>
            <p>{description}</p>
          </section>

          <section className="single-listing__section" aria-labelledby="amenities-title">
            <p className="single-listing__eyebrow">Included features</p>
            <h2 id="amenities-title">Amenities</h2>
            <ul className="single-listing__amenities">
              {property.amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}
            </ul>
          </section>
        </div>

        <aside className="single-listing__information">
          <h2>Property information</h2>
          <dl>
            <div><dt>Monthly rent</dt><dd>{property.rent}</dd></div>
            <div><dt>House type</dt><dd>{property.type}</dd></div>
            <div><dt>Bedrooms</dt><dd>{property.bedrooms}</dd></div>
            <div><dt>Status</dt><dd>{property.availability}</dd></div>
            <div><dt>Listed</dt><dd>{listedDate}</dd></div>
          </dl>
          <div className="single-listing__location-panel">
            <h3>Location</h3>
            <p>{property.location}</p>
            <small>Exact directions can be confirmed directly with the property owner.</small>
          </div>
        </aside>
      </section>

      {relatedProperties.length > 0 && (
        <section className="single-listing__related" aria-labelledby="related-properties-title">
          <div className="container">
            <div className="single-listing__related-heading">
              <div>
                <p className="single-listing__eyebrow">Keep exploring</p>
                <h2 id="related-properties-title">Related homes</h2>
              </div>
              <Link to="/listings">View all listings</Link>
            </div>
            <div className="single-listing__related-grid">
              {relatedProperties.map((relatedProperty) => <PropertyCard key={relatedProperty.id} property={relatedProperty} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default SingleListing
