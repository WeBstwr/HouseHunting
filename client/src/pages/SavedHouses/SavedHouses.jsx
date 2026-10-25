import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PropertyCard from '../../components/PropertyCard/PropertyCard'
import useAuthStore from '../../store/authStore'
import useListingStore from '../../store/listingStore'
import useSavedHouseStore from '../../store/savedHouseStore'
import './savedhouses.css'

const emptySavedPropertyIds = []

const SavedHouses = () => {
  const user = useAuthStore((state) => state.user)
  const properties = useListingStore((state) => state.properties)
  const savedPropertyIdsByTenant = useSavedHouseStore((state) => state.savedPropertyIdsByTenant)
  const clearSavedProperties = useSavedHouseStore((state) => state.clearSavedProperties)
  const savedPropertyIds = savedPropertyIdsByTenant[user?.id] || emptySavedPropertyIds
  const savedProperties = useMemo(
    () => savedPropertyIds.map((id) => properties.find((property) => property.id === id)).filter(Boolean),
    [properties, savedPropertyIds],
  )

  return (
    <main className="saved-houses">
      <section className="saved-houses__hero">
        <div className="container saved-houses__hero-content">
          <div>
            <p className="saved-houses__eyebrow">Tenant space</p>
            <h1>Saved properties</h1>
            <p>Keep the homes you want to revisit in one place.</p>
          </div>
          {savedProperties.length > 0 && <button className="saved-houses__clear" type="button" onClick={() => clearSavedProperties(user.id)}>Clear saved properties</button>}
        </div>
      </section>

      <section className="container saved-houses__content" aria-labelledby="saved-houses-title">
        {savedProperties.length > 0 ? (
          <>
            <div className="saved-houses__heading">
              <div>
                <p className="saved-houses__eyebrow">Your shortlist</p>
                <h2 id="saved-houses-title">{savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved</h2>
              </div>
              <Link to="/listings">Browse more homes</Link>
            </div>
            <div className="saved-houses__grid">
              {savedProperties.map((property) => <PropertyCard key={property.id} property={property} />)}
            </div>
          </>
        ) : (
          <section className="saved-houses__empty" aria-labelledby="saved-houses-empty-title">
            <p className="saved-houses__eyebrow">Nothing saved yet</p>
            <h2 id="saved-houses-empty-title">Start building your shortlist</h2>
            <p>Save homes from Listings or a property page to compare them later.</p>
            <Link className="saved-houses__browse" to="/listings">Browse available homes</Link>
          </section>
        )}
      </section>
    </main>
  )
}

export default SavedHouses
