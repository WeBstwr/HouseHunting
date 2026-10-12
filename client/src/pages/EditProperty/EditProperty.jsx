import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { houseTypes, listingAmenities } from '../../data/listingData'
import useAuthStore from '../../store/authStore'
import useListingStore from '../../store/listingStore'
import './editproperty.css'

const MAX_IMAGES = 5
const MAX_FILE_SIZE = 3 * 1024 * 1024
const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

const toImageItems = (property) => [...new Set([...(property.images || []), property.image].filter(Boolean))]
  .map((preview, index) => ({ id: `${property.id}-${index}`, name: `Property image ${index + 1}`, preview }))

const createForm = (property) => {
  const locationParts = typeof property.location === 'string' ? property.location.split(',').map((part) => part.trim()).filter(Boolean) : []
  const hasCounty = locationParts.length > 1

  return {
    title: property.title || '',
    type: property.typeKey || houseTypes.find((type) => type.name === property.type)?.query || '',
    description: property.description || '',
    price: Number.isFinite(property.price) ? String(property.price) : '',
    bedrooms: Number.isInteger(property.bedroomCount) ? String(property.bedroomCount) : '',
    bathrooms: Number.isInteger(property.bathroomCount) ? String(property.bathroomCount) : '1',
    availability: property.availability || 'Available now',
    county: property.county || (hasCounty ? locationParts.at(-1) : locationParts[0] || ''),
    town: property.town || (hasCounty ? locationParts.at(-2) : locationParts[0] || ''),
    estate: property.estate || (locationParts.length > 2 ? locationParts.slice(0, -2).join(', ') : ''),
    address: property.address || '',
  }
}

const readImageFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve({ id: `${file.name}-${file.lastModified}-${file.size}`, name: file.name, preview: reader.result })
  reader.onerror = () => reject(new Error(`Could not read ${file.name}.`))
  reader.readAsDataURL(file)
})

const EditProperty = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const canManageProperty = useAuthStore((state) => state.canManageProperty)
  const properties = useListingStore((state) => state.properties)
  const updateProperty = useListingStore((state) => state.updateProperty)
  const property = properties.find((listing) => listing.id === id)
  const [form, setForm] = useState(null)
  const [amenities, setAmenities] = useState([])
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!property) return
    setForm(createForm(property))
    setAmenities(Array.isArray(property.amenities) ? property.amenities : [])
    setImages(toImageItems(property))
    setErrors({})
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const toggleAmenity = (amenity) => {
    setAmenities((current) => current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity])
  }

  const handleImageSelection = async (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    event.target.value = ''
    const remainingSlots = MAX_IMAGES - images.length

    if (!selectedFiles.length || remainingSlots <= 0) {
      setErrors((current) => ({ ...current, images: `You can keep up to ${MAX_IMAGES} images.` }))
      return
    }

    const acceptedFiles = selectedFiles.slice(0, remainingSlots).filter((file) => supportedImageTypes.includes(file.type) && file.size <= MAX_FILE_SIZE)
    const rejectedCount = selectedFiles.length - acceptedFiles.length
    if (!acceptedFiles.length) {
      setErrors((current) => ({ ...current, images: 'Choose JPG, PNG, or WebP images no larger than 3 MB.' }))
      return
    }

    try {
      const previews = await Promise.all(acceptedFiles.map(readImageFile))
      setImages((current) => [...current, ...previews])
      setErrors((current) => ({ ...current, images: rejectedCount ? 'Some files were skipped. Use JPG, PNG, or WebP images no larger than 3 MB.' : '' }))
    } catch (error) {
      setErrors((current) => ({ ...current, images: error.message }))
    }
  }

  const validate = () => {
    const nextErrors = {}
    const price = Number(form.price)
    const bedrooms = Number(form.bedrooms)
    const bathrooms = Number(form.bathrooms)

    if (form.title.trim().length < 3) nextErrors.title = 'Enter a property title with at least 3 characters.'
    if (!form.type) nextErrors.type = 'Choose a house type.'
    if (form.description.trim().length > 700) nextErrors.description = 'Keep the description within 700 characters.'
    if (!Number.isFinite(price) || price <= 0) nextErrors.price = 'Enter a valid monthly rent greater than zero.'
    if (form.bedrooms === '' || !Number.isInteger(bedrooms) || bedrooms < 0) nextErrors.bedrooms = 'Choose the number of bedrooms.'
    if (form.bathrooms === '' || !Number.isInteger(bathrooms) || bathrooms < 0) nextErrors.bathrooms = 'Choose the number of bathrooms.'
    if (!form.county.trim()) nextErrors.county = 'Enter the county.'
    if (!form.town.trim()) nextErrors.town = 'Enter the town or city.'
    if (!images.length) nextErrors.images = 'Keep at least one property image.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isSubmitting || !form) return

    const currentProperty = properties.find((listing) => listing.id === id)
    if (!currentProperty || !canManageProperty(currentProperty)) {
      setErrors({ submission: 'Your access to edit this property is no longer available.' })
      return
    }
    if (!validate()) return

    const selectedType = houseTypes.find((type) => type.query === form.type)
    const bedroomCount = Number(form.bedrooms)
    const updates = {
      title: form.title.trim(),
      location: [form.estate.trim(), form.town.trim(), form.county.trim()].filter(Boolean).join(', '),
      address: form.address.trim(),
      description: form.description.trim(),
      rent: `KES ${Number(form.price).toLocaleString('en-KE')}`,
      price: Number(form.price),
      type: selectedType.name,
      typeKey: selectedType.query,
      bedrooms: bedroomCount === 0 ? 'Studio' : `${bedroomCount} ${bedroomCount === 1 ? 'bed' : 'beds'}`,
      bedroomCount,
      bathroomCount: Number(form.bathrooms),
      availability: form.availability,
      amenities,
      image: images[0].preview,
      images: images.map((image) => image.preview),
    }

    setIsSubmitting(true)
    const saved = updateProperty(id, updates)
    setIsSubmitting(false)

    if (!saved) {
      setErrors({ submission: 'The property could not be updated. Please return to your listings and try again.' })
      return
    }

    navigate(`/listings/${id}`, { replace: true, state: { notice: 'Property updated successfully.' } })
  }

  if (!property) {
    return (
      <main className="edit-property">
        <section className="container edit-property__state" aria-labelledby="edit-property-missing-title">
          <p className="add-property__eyebrow">Property unavailable</p>
          <h1 id="edit-property-missing-title">Property not found</h1>
          <p>The listing may have been removed or the edit link is incorrect.</p>
          <Link className="add-property__submit" to="/my-listings">Return to my listings</Link>
        </section>
      </main>
    )
  }

  if (!canManageProperty(property)) {
    return (
      <main className="edit-property">
        <section className="container edit-property__state" aria-labelledby="edit-property-denied-title">
          <p className="add-property__eyebrow">Access restricted</p>
          <h1 id="edit-property-denied-title">You cannot edit this property</h1>
          <p>Only the listing owner or an explicitly assigned agent can make changes.</p>
          <Link className="add-property__submit" to="/my-listings">Return to my listings</Link>
        </section>
      </main>
    )
  }

  if (!form) {
    return <main className="edit-property"><section className="container edit-property__state" aria-live="polite"><p>Loading property details…</p></section></main>
  }

  return (
    <main className="edit-property add-property">
      <section className="add-property__hero">
        <div className="container">
          <p className="add-property__eyebrow">{user?.role === 'agent' ? 'Agent workspace' : 'Landlord space'}</p>
          <h1>Edit property</h1>
          <p>Update the listing details renters see. Ownership and management assignments cannot be changed here.</p>
        </div>
      </section>

      <section className="container add-property__content">
        <form className="add-property__form" onSubmit={handleSubmit} noValidate>
          <section className="add-property__section" aria-labelledby="edit-basic-details-title">
            <div className="add-property__section-heading"><p className="add-property__eyebrow">01. Property details</p><h2 id="edit-basic-details-title">Update the listing</h2></div>
            <div className="add-property__grid add-property__grid--three">
              <div className="add-property__field add-property__field--wide"><label htmlFor="property-title">Property title <span aria-hidden="true">*</span></label><input id="property-title" name="title" value={form.title} onChange={handleChange} aria-invalid={Boolean(errors.title)} />{errors.title && <p className="add-property__error">{errors.title}</p>}</div>
              <div className="add-property__field"><label htmlFor="property-type">House type <span aria-hidden="true">*</span></label><select id="property-type" name="type" value={form.type} onChange={handleChange} aria-invalid={Boolean(errors.type)}><option value="">Choose type</option>{houseTypes.map((type) => <option key={type.query} value={type.query}>{type.name}</option>)}</select>{errors.type && <p className="add-property__error">{errors.type}</p>}</div>
              <div className="add-property__field"><label htmlFor="property-price">Monthly rent (KES) <span aria-hidden="true">*</span></label><input id="property-price" name="price" type="number" min="1" step="500" value={form.price} onChange={handleChange} aria-invalid={Boolean(errors.price)} />{errors.price && <p className="add-property__error">{errors.price}</p>}</div>
              <div className="add-property__field"><label htmlFor="property-bedrooms">Bedrooms <span aria-hidden="true">*</span></label><select id="property-bedrooms" name="bedrooms" value={form.bedrooms} onChange={handleChange} aria-invalid={Boolean(errors.bedrooms)}><option value="">Choose bedrooms</option><option value="0">Studio</option><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option><option value="4">4+ bedrooms</option></select>{errors.bedrooms && <p className="add-property__error">{errors.bedrooms}</p>}</div>
              <div className="add-property__field"><label htmlFor="property-bathrooms">Bathrooms <span aria-hidden="true">*</span></label><select id="property-bathrooms" name="bathrooms" value={form.bathrooms} onChange={handleChange} aria-invalid={Boolean(errors.bathrooms)}><option value="">Choose bathrooms</option><option value="1">1 bathroom</option><option value="2">2 bathrooms</option><option value="3">3 bathrooms</option><option value="4">4+ bathrooms</option></select>{errors.bathrooms && <p className="add-property__error">{errors.bathrooms}</p>}</div>
              <div className="add-property__field"><label htmlFor="property-availability">Availability</label><select id="property-availability" name="availability" value={form.availability} onChange={handleChange}><option>Available now</option><option>Viewing open</option><option>Available soon</option></select></div>
              <div className="add-property__field add-property__field--full"><label htmlFor="property-description">Description</label><textarea id="property-description" name="description" value={form.description} onChange={handleChange} maxLength="700" /><div className="add-property__field-help"><span className={errors.description ? 'add-property__field-error-text' : ''}>{errors.description || 'Maximum 700 characters.'}</span><span>{form.description.length}/700</span></div></div>
            </div>
          </section>

          <section className="add-property__section" aria-labelledby="edit-location-title">
            <div className="add-property__section-heading"><p className="add-property__eyebrow">02. Location</p><h2 id="edit-location-title">Keep the location accurate</h2></div>
            <div className="add-property__grid add-property__grid--three">
              <div className="add-property__field"><label htmlFor="property-county">County <span aria-hidden="true">*</span></label><input id="property-county" name="county" value={form.county} onChange={handleChange} aria-invalid={Boolean(errors.county)} />{errors.county && <p className="add-property__error">{errors.county}</p>}</div>
              <div className="add-property__field"><label htmlFor="property-town">Town or city <span aria-hidden="true">*</span></label><input id="property-town" name="town" value={form.town} onChange={handleChange} aria-invalid={Boolean(errors.town)} />{errors.town && <p className="add-property__error">{errors.town}</p>}</div>
              <div className="add-property__field"><label htmlFor="property-estate">Estate or neighbourhood</label><input id="property-estate" name="estate" value={form.estate} onChange={handleChange} /></div>
              <div className="add-property__field add-property__field--full"><label htmlFor="property-address">Location description</label><input id="property-address" name="address" value={form.address} onChange={handleChange} /></div>
            </div>
          </section>

          <section className="add-property__section" aria-labelledby="edit-features-title"><div className="add-property__section-heading"><p className="add-property__eyebrow">03. Features</p><h2 id="edit-features-title">Update the included amenities</h2></div><fieldset className="add-property__amenities"><legend>Choose all that apply</legend><div>{listingAmenities.map((amenity) => <label className="add-property__amenity" key={amenity}><input type="checkbox" checked={amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} /><span>{amenity}</span></label>)}</div></fieldset></section>

          <section className="add-property__section" aria-labelledby="edit-images-title"><div className="add-property__section-heading"><p className="add-property__eyebrow">04. Photos</p><h2 id="edit-images-title">Keep the property photos current</h2><p>Existing images are retained unless you remove or replace them. JPG, PNG, and WebP files up to 3 MB are supported.</p></div><div className="add-property__image-picker"><label className="add-property__upload" htmlFor="property-images"><span>Add replacement images</span><small>{images.length} of {MAX_IMAGES} selected</small></label><input id="property-images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageSelection} disabled={images.length >= MAX_IMAGES} />{errors.images && <p className="add-property__error">{errors.images}</p>}{images.length > 0 && <div className="add-property__previews" aria-label="Selected property images">{images.map((image) => <div className="add-property__preview" key={image.id}><img src={image.preview} alt={`Preview of ${image.name}`} /><button type="button" onClick={() => { setImages((current) => current.filter((item) => item.id !== image.id)); setErrors((current) => ({ ...current, images: '' })) }}>Remove</button></div>)}</div>}</div></section>

          <div className="add-property__footer"><div><p>Changes are stored only in the current browser session until backend integration is available.</p>{errors.submission && <p className="add-property__error">{errors.submission}</p>}</div><div className="edit-property__actions"><Link className="add-property__secondary-button" to={`/listings/${id}`}>Cancel</Link><button className="add-property__submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving changes…' : 'Save changes'}</button></div></div>
        </form>
      </section>
    </main>
  )
}

export default EditProperty
