import { useState } from 'react'
import { Link } from 'react-router-dom'
import { houseTypes, listingAmenities } from '../../data/listingData'
import useAuthStore from '../../store/authStore'
import useListingStore from '../../store/listingStore'
import './addproperty.css'

const MAX_IMAGES = 5
const MAX_FILE_SIZE = 3 * 1024 * 1024
const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

const initialForm = {
  title: '', type: '', description: '', price: '', bedrooms: '', bathrooms: '', availability: 'Available now', county: '', town: '', estate: '', address: '',
}

const readImageFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve({ id: `${file.name}-${file.lastModified}-${file.size}`, name: file.name, preview: reader.result })
  reader.onerror = () => reject(new Error(`Could not read ${file.name}.`))
  reader.readAsDataURL(file)
})

const AddProperty = () => {
  const currentUser = useAuthStore((state) => state.user)
  const addProperty = useListingStore((state) => state.addProperty)
  const [form, setForm] = useState(initialForm)
  const [amenities, setAmenities] = useState([])
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedPropertyId, setSubmittedPropertyId] = useState('')

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
      setErrors((current) => ({ ...current, images: `You can add up to ${MAX_IMAGES} images.` }))
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

  const removeImage = (imageId) => {
    setImages((current) => current.filter((image) => image.id !== imageId))
    setErrors((current) => ({ ...current, images: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    const price = Number(form.price)
    const bedrooms = Number(form.bedrooms)
    const bathrooms = Number(form.bathrooms)

    if (form.title.trim().length < 3) nextErrors.title = 'Enter a property title with at least 3 characters.'
    if (!form.type) nextErrors.type = 'Choose a house type.'
    if (!form.description.trim()) nextErrors.description = 'Add a short property description.'
    if (form.description.trim().length > 700) nextErrors.description = 'Keep the description within 700 characters.'
    if (!Number.isFinite(price) || price <= 0) nextErrors.price = 'Enter a valid monthly rent greater than zero.'
    if (form.bedrooms === '' || !Number.isInteger(bedrooms) || bedrooms < 0) nextErrors.bedrooms = 'Choose the number of bedrooms.'
    if (form.bathrooms === '' || !Number.isInteger(bathrooms) || bathrooms < 0) nextErrors.bathrooms = 'Choose the number of bathrooms.'
    if (!form.county.trim()) nextErrors.county = 'Enter the county.'
    if (!form.town.trim()) nextErrors.town = 'Enter the town or city.'
    if (!images.length) nextErrors.images = 'Add at least one property image.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const resetForm = () => {
    setForm(initialForm)
    setAmenities([])
    setImages([])
    setErrors({})
    setSubmittedPropertyId('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isSubmitting || submittedPropertyId) return

    if (!currentUser || currentUser.role !== 'landlord') {
      setErrors((current) => ({ ...current, submission: 'A landlord mock session is required to add a property.' }))
      return
    }

    if (!validate()) return

    setIsSubmitting(true)
    const selectedType = houseTypes.find((type) => type.query === form.type)
    const bedroomCount = Number(form.bedrooms)
    const idBase = form.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const uniqueSuffix = globalThis.crypto?.randomUUID?.().slice(0, 8) || Date.now().toString(36)
    const property = {
      id: `${idBase || 'property'}-${uniqueSuffix}`,
      ownerId: currentUser.id,
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
      createdAt: new Date().toISOString().slice(0, 10),
    }

    addProperty(property)
    setSubmittedPropertyId(property.id)
    setIsSubmitting(false)
  }

  if (submittedPropertyId) {
    return (
      <main className="add-property">
        <section className="container add-property__success" aria-labelledby="add-property-success-title">
          <p className="add-property__eyebrow">Listing added</p>
          <h1 id="add-property-success-title">Your property is ready to review.</h1>
          <p>This listing has been added to the current browser session. It will be available in Listings until the page is refreshed or a backend is connected.</p>
          <div className="add-property__success-actions">
            <Link className="add-property__submit" to={`/listings/${submittedPropertyId}`}>View property</Link>
            <button className="add-property__secondary-button" type="button" onClick={resetForm}>Add another property</button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="add-property">
      <section className="add-property__hero">
        <div className="container">
          <p className="add-property__eyebrow">For property owners</p>
          <h1>List a property</h1>
          <p>Share the information renters need to decide whether your space is right for them.</p>
        </div>
      </section>

      <section className="container add-property__content">
        <form className="add-property__form" onSubmit={handleSubmit} noValidate>
          <section className="add-property__section" aria-labelledby="basic-details-title">
            <div className="add-property__section-heading"><p className="add-property__eyebrow">01. Property details</p><h2 id="basic-details-title">Tell renters about the home</h2></div>
            <div className="add-property__grid add-property__grid--three">
              <div className="add-property__field add-property__field--wide">
                <label htmlFor="property-title">Property title <span aria-hidden="true">*</span></label>
                <input id="property-title" name="title" value={form.title} onChange={handleChange} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'property-title-error' : undefined} placeholder="e.g. Bright 2 Bedroom Apartment" />
                {errors.title && <p id="property-title-error" className="add-property__error">{errors.title}</p>}
              </div>
              <div className="add-property__field">
                <label htmlFor="property-type">House type <span aria-hidden="true">*</span></label>
                <select id="property-type" name="type" value={form.type} onChange={handleChange} aria-invalid={Boolean(errors.type)}><option value="">Choose type</option>{houseTypes.map((type) => <option key={type.query} value={type.query}>{type.name}</option>)}</select>
                {errors.type && <p className="add-property__error">{errors.type}</p>}
              </div>
              <div className="add-property__field">
                <label htmlFor="property-price">Monthly rent (KES) <span aria-hidden="true">*</span></label>
                <input id="property-price" name="price" type="number" min="1" step="500" value={form.price} onChange={handleChange} aria-invalid={Boolean(errors.price)} placeholder="e.g. 25000" />
                {errors.price && <p className="add-property__error">{errors.price}</p>}
              </div>
              <div className="add-property__field">
                <label htmlFor="property-bedrooms">Bedrooms <span aria-hidden="true">*</span></label>
                <select id="property-bedrooms" name="bedrooms" value={form.bedrooms} onChange={handleChange} aria-invalid={Boolean(errors.bedrooms)}><option value="">Choose bedrooms</option><option value="0">Studio</option><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option><option value="4">4+ bedrooms</option></select>
                {errors.bedrooms && <p className="add-property__error">{errors.bedrooms}</p>}
              </div>
              <div className="add-property__field">
                <label htmlFor="property-bathrooms">Bathrooms <span aria-hidden="true">*</span></label>
                <select id="property-bathrooms" name="bathrooms" value={form.bathrooms} onChange={handleChange} aria-invalid={Boolean(errors.bathrooms)}><option value="">Choose bathrooms</option><option value="1">1 bathroom</option><option value="2">2 bathrooms</option><option value="3">3 bathrooms</option><option value="4">4+ bathrooms</option></select>
                {errors.bathrooms && <p className="add-property__error">{errors.bathrooms}</p>}
              </div>
              <div className="add-property__field"><label htmlFor="property-availability">Availability</label><select id="property-availability" name="availability" value={form.availability} onChange={handleChange}><option>Available now</option><option>Viewing open</option><option>Available soon</option></select></div>
              <div className="add-property__field add-property__field--full">
                <label htmlFor="property-description">Description <span aria-hidden="true">*</span></label>
                <textarea id="property-description" name="description" value={form.description} onChange={handleChange} maxLength="700" aria-invalid={Boolean(errors.description)} aria-describedby="property-description-help" placeholder="Describe the home, its layout, and anything renters should know." />
                <div className="add-property__field-help" id="property-description-help"><span className={errors.description ? 'add-property__field-error-text' : ''}>{errors.description || 'Maximum 700 characters.'}</span><span>{form.description.length}/700</span></div>
              </div>
            </div>
          </section>

          <section className="add-property__section" aria-labelledby="location-details-title">
            <div className="add-property__section-heading"><p className="add-property__eyebrow">02. Location</p><h2 id="location-details-title">Help renters find the area</h2></div>
            <div className="add-property__grid add-property__grid--three">
              <div className="add-property__field"><label htmlFor="property-county">County <span aria-hidden="true">*</span></label><input id="property-county" name="county" value={form.county} onChange={handleChange} aria-invalid={Boolean(errors.county)} placeholder="e.g. Kiambu" />{errors.county && <p className="add-property__error">{errors.county}</p>}</div>
              <div className="add-property__field"><label htmlFor="property-town">Town or city <span aria-hidden="true">*</span></label><input id="property-town" name="town" value={form.town} onChange={handleChange} aria-invalid={Boolean(errors.town)} placeholder="e.g. Ruiru" />{errors.town && <p className="add-property__error">{errors.town}</p>}</div>
              <div className="add-property__field"><label htmlFor="property-estate">Estate or neighbourhood</label><input id="property-estate" name="estate" value={form.estate} onChange={handleChange} placeholder="e.g. Membley" /></div>
              <div className="add-property__field add-property__field--full"><label htmlFor="property-address">Location description</label><input id="property-address" name="address" value={form.address} onChange={handleChange} placeholder="e.g. Near the main road and local shopping centre" /></div>
            </div>
          </section>

          <section className="add-property__section" aria-labelledby="property-features-title">
            <div className="add-property__section-heading"><p className="add-property__eyebrow">03. Features</p><h2 id="property-features-title">What does the property include?</h2></div>
            <fieldset className="add-property__amenities"><legend>Choose all that apply</legend><div>{listingAmenities.map((amenity) => <label className="add-property__amenity" key={amenity}><input type="checkbox" checked={amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} /><span>{amenity}</span></label>)}</div></fieldset>
          </section>

          <section className="add-property__section" aria-labelledby="property-images-title">
            <div className="add-property__section-heading"><p className="add-property__eyebrow">04. Photos</p><h2 id="property-images-title">Show renters the space</h2><p>Add up to {MAX_IMAGES} clear photos. JPG, PNG, and WebP files up to 3 MB are supported.</p></div>
            <div className="add-property__image-picker">
              <label className="add-property__upload" htmlFor="property-images"><span>Select images</span><small>{images.length} of {MAX_IMAGES} selected</small></label>
              <input id="property-images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageSelection} disabled={images.length >= MAX_IMAGES} />
              {errors.images && <p className="add-property__error">{errors.images}</p>}
              {images.length > 0 && <div className="add-property__previews" aria-label="Selected property images">{images.map((image) => <div className="add-property__preview" key={image.id}><img src={image.preview} alt={`Preview of ${image.name}`} /><button type="button" onClick={() => removeImage(image.id)} aria-label={`Remove ${image.name}`}>Remove</button></div>)}</div>}
            </div>
          </section>

          <div className="add-property__footer"><div><p>Listings added here are stored only in this browser session until backend integration is available.</p>{errors.submission && <p className="add-property__error">{errors.submission}</p>}</div><button className="add-property__submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding listing...' : 'Add property listing'}</button></div>
        </form>
      </section>
    </main>
  )
}

export default AddProperty
