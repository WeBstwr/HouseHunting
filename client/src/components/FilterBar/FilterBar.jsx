import './filterbar.css'

const FilterBar = ({ filters, houseTypes, amenities, onChange, onReset }) => (
  <form className="filter-bar" onSubmit={(event) => event.preventDefault()}>
    <div className="filter-bar__field filter-bar__field--location">
      <label htmlFor="listing-location">Location</label>
      <input
        id="listing-location"
        name="location"
        type="search"
        placeholder="e.g. Ruiru or Nairobi"
        value={filters.location}
        onChange={onChange}
      />
    </div>

    <div className="filter-bar__field">
      <label htmlFor="listing-type">House type</label>
      <select id="listing-type" name="type" value={filters.type} onChange={onChange}>
        <option value="">Any type</option>
        {houseTypes.map((type) => <option key={type.query} value={type.query}>{type.name}</option>)}
      </select>
    </div>

    <div className="filter-bar__field">
      <label htmlFor="listing-min-price">Minimum rent</label>
      <select id="listing-min-price" name="minPrice" value={filters.minPrice} onChange={onChange}>
        <option value="">No minimum</option>
        <option value="10000">KES 10,000</option>
        <option value="20000">KES 20,000</option>
        <option value="30000">KES 30,000</option>
        <option value="40000">KES 40,000</option>
      </select>
    </div>

    <div className="filter-bar__field">
      <label htmlFor="listing-max-price">Maximum rent</label>
      <select id="listing-max-price" name="maxPrice" value={filters.maxPrice} onChange={onChange}>
        <option value="">No maximum</option>
        <option value="15000">KES 15,000</option>
        <option value="25000">KES 25,000</option>
        <option value="35000">KES 35,000</option>
        <option value="50000">KES 50,000</option>
      </select>
    </div>

    <div className="filter-bar__field">
      <label htmlFor="listing-bedrooms">Bedrooms</label>
      <select id="listing-bedrooms" name="bedrooms" value={filters.bedrooms} onChange={onChange}>
        <option value="">Any bedrooms</option>
        <option value="0">Studio</option>
        <option value="1">1 bedroom</option>
        <option value="2">2 bedrooms</option>
        <option value="3">3 bedrooms</option>
      </select>
    </div>

    <div className="filter-bar__field">
      <label htmlFor="listing-amenity">Feature</label>
      <select id="listing-amenity" name="amenity" value={filters.amenity} onChange={onChange}>
        <option value="">Any feature</option>
        {amenities.map((amenity) => <option key={amenity} value={amenity}>{amenity}</option>)}
      </select>
    </div>

    <button className="filter-bar__reset" type="button" onClick={onReset}>Reset filters</button>
  </form>
)

export default FilterBar
