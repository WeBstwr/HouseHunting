import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useSavedHouseStore from '../../store/savedHouseStore'
import './propertycard.css'

const PropertyCard = ({ property, editTo }) => {
  const user = useAuthStore((state) => state.user)
  const savedPropertyIdsByTenant = useSavedHouseStore((state) => state.savedPropertyIdsByTenant)
  const toggleSavedProperty = useSavedHouseStore((state) => state.toggleSavedProperty)
  const savedPropertyIds = user?.role === 'tenant' ? savedPropertyIdsByTenant[user.id] || [] : []
  const isSaved = savedPropertyIds.includes(property.id)

  return (
    <article className="property-card">
      <div className="property-card__image-wrap">
        <img className="property-card__image" src={property.image} alt={`${property.title} in ${property.location}`} />
        <span className="property-card__availability">{property.availability}</span>
      </div>
      <div className="property-card__content">
        <p className="property-card__rent">{property.rent} <span>/ month</span></p>
        <h2>{property.title}</h2>
        <p className="property-card__location">{property.location}</p>
        <div className="property-card__details">
          <span>{property.type}</span>
          <span>{property.bedrooms}</span>
        </div>
        <ul className="property-card__amenities" aria-label="Property features">
          {property.amenities.slice(0, 3).map((amenity) => <li key={amenity}>{amenity}</li>)}
        </ul>
        <div className="property-card__actions">
          <Link className="property-card__link" to={`/listings/${property.id}`}>View property</Link>
          {user?.role === 'tenant' && <button className={`property-card__save${isSaved ? ' property-card__save--active' : ''}`} type="button" onClick={() => toggleSavedProperty(user.id, property.id)} aria-pressed={isSaved}>{isSaved ? 'Saved' : 'Save property'}</button>}
          {editTo && <Link className="property-card__edit-link" to={editTo}>Edit property</Link>}
        </div>
      </div>
    </article>
  )
}

export default PropertyCard
