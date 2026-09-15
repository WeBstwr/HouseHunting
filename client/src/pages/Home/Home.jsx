import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { featuredProperties, houseTypes, locations, steps } from '../../store/homeData'
import './home.css'

const Home = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState({ location: '', type: '', price: '' })
  const [searchError, setSearchError] = useState('')

  const updateSearch = (event) => {
    const { name, value } = event.target
    setSearch((current) => ({ ...current, [name]: value }))
    if (name === 'location' && value.trim()) setSearchError('')
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const location = search.location.trim()

    if (!location) {
      setSearchError('Enter a location to begin your search.')
      return
    }

    const parameters = new URLSearchParams({ location })
    if (search.type) parameters.set('type', search.type)
    if (search.price) parameters.set('price', search.price)
    navigate(`/listings?${parameters.toString()}`)
  }

  return (
    <main className="home">
      <section className="home__hero" aria-labelledby="home-hero-title">
        <div className="container home__hero-layout">
          <div className="home__hero-content">
            <p className="home__eyebrow">A simpler way to rent</p>
            <h1 id="home-hero-title">Find a place you’ll love to call home.</h1>
            <p className="home__hero-copy">
              Discover available houses, apartments, and rental spaces in the places that matter to you.
            </p>

            <form className="home__search" onSubmit={handleSearch} noValidate>
              <div className="home__search-field home__search-field--location">
                <label htmlFor="home-location">Location</label>
                <input
                  id="home-location"
                  name="location"
                  type="search"
                  placeholder="Where do you want to live?"
                  value={search.location}
                  onChange={updateSearch}
                  aria-describedby={searchError ? 'home-search-error' : undefined}
                  aria-invalid={Boolean(searchError)}
                />
              </div>
              <div className="home__search-field">
                <label htmlFor="home-type">House type</label>
                <select id="home-type" name="type" value={search.type} onChange={updateSearch}>
                  <option value="">Any type</option>
                  {houseTypes.map((type) => <option key={type.query} value={type.query}>{type.name}</option>)}
                </select>
              </div>
              <div className="home__search-field">
                <label htmlFor="home-price">Maximum rent</label>
                <select id="home-price" name="price" value={search.price} onChange={updateSearch}>
                  <option value="">Any budget</option>
                  <option value="15000">Up to KES 15,000</option>
                  <option value="25000">Up to KES 25,000</option>
                  <option value="40000">Up to KES 40,000</option>
                  <option value="60000">Up to KES 60,000</option>
                </select>
              </div>
              <button className="home__search-button" type="submit">Search homes <span aria-hidden="true">→</span></button>
              {searchError && <p className="home__search-error" id="home-search-error" role="alert">{searchError}</p>}
            </form>

            <div className="home__hero-actions">
              <Link className="home__text-link" to="/listings">Browse houses <span aria-hidden="true">→</span></Link>
              <Link className="home__landlord-link" to="/add-property">Are you a landlord? List your property <span aria-hidden="true">→</span></Link>
            </div>
          </div>

          <div className="home__hero-visual" role="img" aria-label="A welcoming modern home exterior">
            <div className="home__hero-image" />
            <div className="home__hero-note">
              <span className="home__hero-note-mark" aria-hidden="true">⌂</span>
              <span>Start your search with confidence.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home__section home__types" aria-labelledby="house-types-title">
        <div className="container">
          <div className="home__section-heading">
            <p className="home__eyebrow">Browse your way</p>
            <h2 id="house-types-title">Find the right space for you</h2>
            <p>From a first bedsitter to a home for the whole family, begin with the space you need.</p>
          </div>
          <div className="home__type-grid">
            {houseTypes.map((type) => (
              <Link className="home__type-card" key={type.query} to={`/listings?type=${type.query}`}>
                <span className="home__type-marker" aria-hidden="true">{type.marker}</span>
                <span className="home__type-icon" aria-hidden="true">⌂</span>
                <h3>{type.name}</h3>
                <p>{type.detail}</p>
                <span className="home__card-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home__section home__locations" aria-labelledby="locations-title">
        <div className="container home__locations-layout">
          <div className="home__locations-intro">
            <p className="home__eyebrow">Search by area</p>
            <h2 id="locations-title">Explore places that feel right</h2>
            <p>Browse sample location filters to see how easily you can focus your search.</p>
            <Link className="home__text-link" to="/listings">Explore all locations <span aria-hidden="true">→</span></Link>
          </div>
          <div className="home__location-grid">
            {locations.map((location) => (
              <Link className="home__location-card" key={location.name} to={`/listings?location=${encodeURIComponent(location.name)}`}>
                <span className="home__location-pin" aria-hidden="true" />
                <span><strong>{location.name}</strong><small>{location.detail}</small></span>
                <span className="home__location-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home__section home__featured" aria-labelledby="featured-title">
        <div className="container">
          <div className="home__featured-heading">
            <div className="home__section-heading">
              <p className="home__eyebrow">Homes to consider</p>
              <h2 id="featured-title">Featured homes</h2>
              <p>A small selection of homes to help you picture what’s possible.</p>
            </div>
            <Link className="home__text-link" to="/listings">View all homes <span aria-hidden="true">→</span></Link>
          </div>
          <div className="home__property-grid">
            {featuredProperties.map((property) => (
              <article className="home__property-card" key={property.id}>
                <div className="home__property-image-wrap">
                  <img src={property.image} alt={`${property.title} in ${property.location}`} className="home__property-image" />
                  <span className="home__availability">{property.availability}</span>
                </div>
                <div className="home__property-content">
                  <p className="home__property-rent">{property.rent} <span>/ month</span></p>
                  <h3>{property.title}</h3>
                  <p className="home__property-location"><span aria-hidden="true">•</span> {property.location}</p>
                  <div className="home__property-meta"><span>{property.type}</span><span>{property.bedrooms}</span></div>
                  <Link className="home__property-link" to={`/listings/${property.id}`}>View property <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home__section home__works" aria-labelledby="works-title">
        <div className="container">
          <div className="home__works-heading">
            <p className="home__eyebrow">Made for moving forward</p>
            <h2 id="works-title">How HouseHunting works</h2>
          </div>
          <div className="home__steps">
            {steps.map((step) => (
              <article className="home__step" key={step.number}>
                <span className="home__step-number">{step.number}</span>
                <div className="home__step-line" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home__landlord" aria-labelledby="landlord-title">
        <div className="container home__landlord-content">
          <div>
            <p className="home__eyebrow">For property owners</p>
            <h2 id="landlord-title">Have a property to rent?</h2>
            <p>List your available space and reach people actively looking for their next home.</p>
          </div>
          <Link className="home__landlord-button" to="/add-property">List your property <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  )
}

export default Home
