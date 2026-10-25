import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PropertyCard from '../../components/PropertyCard/PropertyCard'
import useAuthStore from '../../store/authStore'
import useListingStore from '../../store/listingStore'
import useSavedHouseStore from '../../store/savedHouseStore'
import './tenantdashboard.css'

const emptySavedPropertyIds = []

const TenantDashboard = () => {
  const user = useAuthStore((state) => state.user)
  const properties = useListingStore((state) => state.properties)
  const savedPropertyIdsByTenant = useSavedHouseStore((state) => state.savedPropertyIdsByTenant)
  const savedPropertyIds = savedPropertyIdsByTenant[user?.id] || emptySavedPropertyIds
  const savedProperties = useMemo(
    () => savedPropertyIds.map((id) => properties.find((property) => property.id === id)).filter(Boolean),
    [properties, savedPropertyIds],
  )
  const recentlySavedProperties = useMemo(
    () => savedPropertyIds.slice(-3).reverse().map((id) => properties.find((property) => property.id === id)).filter(Boolean),
    [properties, savedPropertyIds],
  )

  return (
    <main className="tenant-dashboard">
      <section className="tenant-dashboard__hero">
        <div className="container">
          <p className="tenant-dashboard__eyebrow">Tenant dashboard</p>
          <h1>Welcome back, {user?.name}</h1>
          <p>Pick up your house hunt wherever you left off.</p>
        </div>
      </section>

      <section className="container tenant-dashboard__content">
        <div className="tenant-dashboard__summary">
          <div>
            <p className="tenant-dashboard__eyebrow">Your shortlist</p>
            <h2>{savedProperties.length} saved {savedProperties.length === 1 ? 'property' : 'properties'}</h2>
            <p>Save homes you like and return when you are ready to compare them.</p>
          </div>
          <div className="tenant-dashboard__summary-actions">
            <Link className="tenant-dashboard__saved-link" to="/saved-houses">View saved properties</Link>
            <Link className="tenant-dashboard__browse-link" to="/listings">Browse homes</Link>
          </div>
        </div>

        <section className="tenant-dashboard__recent" aria-labelledby="recently-saved-title">
          <div className="tenant-dashboard__recent-heading">
            <div>
              <p className="tenant-dashboard__eyebrow">Recently saved</p>
              <h2 id="recently-saved-title">Your latest picks</h2>
            </div>
            {recentlySavedProperties.length > 0 && <Link to="/saved-houses">View all</Link>}
          </div>

          {recentlySavedProperties.length > 0 ? (
            <div className="tenant-dashboard__grid">
              {recentlySavedProperties.map((property) => <PropertyCard key={property.id} property={property} />)}
            </div>
          ) : (
            <div className="tenant-dashboard__empty">
              <h3>Your saved homes will appear here</h3>
              <p>Browse available properties and save the ones you want to revisit.</p>
              <Link to="/listings">Explore listings</Link>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default TenantDashboard
