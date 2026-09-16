import { Link } from 'react-router-dom'
import './propertycard.css'

const PropertyCard = ({ property }) => (
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
      <Link className="property-card__link" to={`/listings/${property.id}`}>View property</Link>
    </div>
  </article>
)

export default PropertyCard
