import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PropertyCard from '../../components/PropertyCard/PropertyCard'
import useAuthStore from '../../store/authStore'
import useListingStore from '../../store/listingStore'
import './mylistings.css'

const MyListings = () => {
  const user = useAuthStore((state) => state.user)
  const canManageProperty = useAuthStore((state) => state.canManageProperty)
  const properties = useListingStore((state) => state.properties)
  const managedProperties = useMemo(
    () => properties.filter(canManageProperty),
    [canManageProperty, properties],
  )
  const isLandlord = user?.role === 'landlord'

  if (!user || !['landlord', 'agent'].includes(user.role)) {
    return null
  }

  return (
    <main className="my-listings">
      <section className="my-listings__hero">
        <div className="container my-listings__hero-content">
          <div>
            <p className="my-listings__eyebrow">{isLandlord ? 'Landlord space' : 'Agent workspace'}</p>
            <h1>My listings</h1>
            <p>{isLandlord ? 'Manage the properties listed under your current mock landlord account.' : 'Review the properties that have been explicitly assigned to your agent account.'}</p>
          </div>
          {isLandlord && <Link className="my-listings__add-link" to="/add-property">Add property</Link>}
        </div>
      </section>

      <section className="container my-listings__content" aria-labelledby="my-listings-results-title">
        <div className="my-listings__results-heading">
          <div>
            <p className="my-listings__eyebrow">Your portfolio</p>
            <h2 id="my-listings-results-title">{managedProperties.length} {managedProperties.length === 1 ? 'property' : 'properties'} {isLandlord ? 'listed' : 'assigned'}</h2>
          </div>
          <p>{isLandlord ? `Only properties owned by ${user.name} are shown here.` : 'Only properties assigned to this agent are shown here.'}</p>
        </div>

        {managedProperties.length > 0 ? (
          <div className="my-listings__grid">
            {managedProperties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        ) : (
          <section className="my-listings__empty" aria-labelledby="my-listings-empty-title">
            <p className="my-listings__eyebrow">No listings yet</p>
            <h2 id="my-listings-empty-title">{isLandlord ? 'Ready to list your first property?' : 'No properties are assigned to you yet.'}</h2>
            <p>{isLandlord ? 'Properties you add while signed in as this mock landlord will appear here.' : 'An owner must assign this agent account to a property before it appears here.'}</p>
            {isLandlord && <Link className="my-listings__add-link" to="/add-property">Add property</Link>}
          </section>
        )}
      </section>
    </main>
  )
}

export default MyListings
