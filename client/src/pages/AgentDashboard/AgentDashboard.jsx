import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PropertyCard from '../../components/PropertyCard/PropertyCard'
import { mockAccounts } from '../../data/mockAccounts'
import useAuthStore from '../../store/authStore'
import useListingStore from '../../store/listingStore'
import '../LandlordDashboard/landlorddashboard.css'
import './agentdashboard.css'

const AgentDashboard = () => {
  const user = useAuthStore((state) => state.user)
  const canManageProperty = useAuthStore((state) => state.canManageProperty)
  const properties = useListingStore((state) => state.properties)
  const managedProperties = useMemo(() => properties.filter(canManageProperty), [canManageProperty, properties])
  const ownerName = (ownerId) => mockAccounts.find((account) => account.id === ownerId)?.name || 'Property owner'

  return (
    <main className="management-dashboard">
      <section className="management-dashboard__hero"><div className="container management-dashboard__hero-content"><div><p className="management-dashboard__eyebrow">Property agent workspace</p><h1>Welcome back, {user?.name}</h1><p>Review the properties that have been explicitly assigned to you for management.</p></div><div className="management-dashboard__hero-actions"><Link className="management-dashboard__primary-action" to="/my-listings">Managed listings</Link></div></div></section>
      <section className="container management-dashboard__content" aria-labelledby="agent-summary-title"><div className="management-dashboard__section-heading"><div><p className="management-dashboard__eyebrow">Your overview</p><h2 id="agent-summary-title">Management assignments</h2></div><Link to="/my-listings">View all managed listings</Link></div><div className="management-dashboard__stats management-dashboard__stats--single" aria-label="Management assignment total"><article><span>Assigned properties</span><strong>{managedProperties.length}</strong><p>Explicitly assigned to your agent account</p></article></div></section>
      <section className="container management-dashboard__content" aria-labelledby="agent-preview-title"><div className="management-dashboard__section-heading"><div><p className="management-dashboard__eyebrow">Assigned properties</p><h2 id="agent-preview-title">Properties to manage</h2></div><Link to="/my-listings">Manage all listings</Link></div>{managedProperties.length ? <div className="management-dashboard__grid">{managedProperties.slice(0, 3).map((property) => <article className="management-dashboard__property" key={property.id}><PropertyCard editTo={`/edit-property/${property.id}`} property={property} /><p>Managed for: <strong>{ownerName(property.ownerId)}</strong></p></article>)}</div> : <section className="management-dashboard__empty" aria-labelledby="agent-empty-title"><p className="management-dashboard__eyebrow">No assignments yet</p><h2 id="agent-empty-title">No properties are assigned to you</h2><p>Properties will appear here only when this agent account is explicitly assigned to manage them.</p><Link className="management-dashboard__primary-action" to="/my-listings">View managed listings</Link></section>}</section>
    </main>
  )
}

export default AgentDashboard
