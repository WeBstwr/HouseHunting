import { useEffect, useMemo, useState } from 'react'
import './propertygallery.css'

const PropertyGallery = ({ property }) => {
  const images = useMemo(() => [...new Set([...(property.images || []), property.image].filter(Boolean))], [property])
  const [selectedImage, setSelectedImage] = useState(images[0])

  useEffect(() => {
    setSelectedImage(images[0])
  }, [images])

  if (!images.length) {
    return <div className="property-gallery property-gallery--empty">Property photos are not available yet.</div>
  }

  return (
    <section className="property-gallery" aria-label={`Photos of ${property.title}`}>
      <div className="property-gallery__main">
        <img src={selectedImage} alt={`${property.title} in ${property.location}`} />
      </div>
      {images.length > 1 && (
        <div className="property-gallery__thumbnails" aria-label="Choose a property photo">
          {images.map((image, index) => (
            <button
              className={`property-gallery__thumbnail${selectedImage === image ? ' property-gallery__thumbnail--active' : ''}`}
              type="button"
              key={image}
              onClick={() => setSelectedImage(image)}
              aria-label={`Show property photo ${index + 1}`}
              aria-pressed={selectedImage === image}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default PropertyGallery
