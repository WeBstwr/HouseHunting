import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PropertyCard from '../../components/PropertyCard/PropertyCard'
import useAuthStore from '../../store/authStore'
import useListingStore from '../../store/listingStore'
import './landlorddashboard.css'

const LandlordDashboard = () => {
  const user = useAuthStore((state) => state.user)
  const properties = useListingStore((state) => state.properties)
  const ownedProperties = useMemo(() => properties.filter((property) => property.ownerId === user?.id), [properties, user?.id])
  const availableNow = ownedProperties.filter((property) => property.availability === 'Available now').length
  const viewingOpen = ownedProperties.filter((property) => property.availability === 'Viewing open').length

  return (
    <main className="management-dashboard">
      <section className="management-dashboard__hero"><div className="container management-dashboard__hero-content"><div><p className="management-dashboard__eyebrow">Landlord workspace</p><h1>Welcome back, {user?.name}</h1><p>Keep an eye on the listings you own and make updates whenever details change.</p></div><div className="management-dashboard__hero-actions"><Link className="management-dashboard__secondary-action" to="/my-listings">My listings</Link><Link className="management-dashboard__primary-action" to="/add-property">Add property</Link></div></div></section>
      <section className="container management-dashboard__content" aria-labelledby="landlord-summary-title"><div className="management-dashboard__section-heading"><div><p className="management-dashboard__eyebrow">Your overview</p><h2 id="landlord-summary-title">Portfolio summary</h2></div><Link to="/my-listings">View all listings</Link></div><div className="management-dashboard__stats" aria-label="Portfolio totals"><article><span>Total properties</span><strong>{ownedProperties.length}</strong><p>Owned by your account</p></article><article><span>Available now</span><strong>{availableNow}</strong><p>Ready for renter enquiries</p></article><article><span>Viewing open</span><strong>{viewingOpen}</strong><p>Open for prospective renters</p></article></div></section>
      <section className="container management-dashboard__content" aria-labelledby="landlord-preview-title"><div className="management-dashboard__section-heading"><div><p className="management-dashboard__eyebrow">Your properties</p><h2 id="landlord-preview-title">Recent listings</h2></div><Link to="/my-listings">Manage all listings</Link></div>{ownedProperties.length ? <div className="management-dashboard__grid">{ownedProperties.slice(0, 3).map((property) => <PropertyCard editTo={`/edit-property/${property.id}`} key={property.id} property={property} />)}</div> : <section className="management-dashboard__empty" aria-labelledby="landlord-empty-title"><p className="management-dashboard__eyebrow">No listings yet</p><h2 id="landlord-empty-title">Ready to list your first property?</h2><p>Properties you add while signed in to this landlord account will appear here.</p><Link className="management-dashboard__primary-action" to="/add-property">Add property</Link></section>}</section>
    </main>
  )
}

export default LandlordDashboard
