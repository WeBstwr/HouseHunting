import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PropertyCard from '../../components/PropertyCard/PropertyCard'
import useAuthStore from '../../store/authStore'
import useListingStore from '../../store/listingStore'
import './mylistings.css'

const MyListings = () => {
  const user = useAuthStore((state) => state.user)
  const properties = useListingStore((state) => state.properties)
  const ownedProperties = useMemo(
    () => properties.filter((property) => property.ownerId === user?.id),
    [properties, user?.id],
  )

  if (!user || user.role !== 'landlord') {
    return null
  }

  return (
    <main className="my-listings">
      <section className="my-listings__hero">
        <div className="container my-listings__hero-content">
          <div>
            <p className="my-listings__eyebrow">Landlord space</p>
            <h1>My listings</h1>
            <p>Manage the properties listed under your current mock landlord account.</p>
          </div>
          <Link className="my-listings__add-link" to="/add-property">Add property</Link>
        </div>
      </section>

      <section className="container my-listings__content" aria-labelledby="my-listings-results-title">
        <div className="my-listings__results-heading">
          <div>
            <p className="my-listings__eyebrow">Your portfolio</p>
            <h2 id="my-listings-results-title">{ownedProperties.length} {ownedProperties.length === 1 ? 'property' : 'properties'} listed</h2>
          </div>
          <p>Only properties owned by {user.name} are shown here.</p>
        </div>

        {ownedProperties.length > 0 ? (
          <div className="my-listings__grid">
            {ownedProperties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        ) : (
          <section className="my-listings__empty" aria-labelledby="my-listings-empty-title">
            <p className="my-listings__eyebrow">No listings yet</p>
            <h2 id="my-listings-empty-title">Ready to list your first property?</h2>
            <p>Properties you add while signed in as this mock landlord will appear here.</p>
            <Link className="my-listings__add-link" to="/add-property">Add property</Link>
          </section>
        )}
      </section>
    </main>
  )
}

export default MyListings
