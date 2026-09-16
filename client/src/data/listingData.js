export const houseTypes = [
  { name: 'Bedsitter', query: 'bedsitter', detail: 'Smart, practical spaces for independent living.', marker: '01' },
  { name: '1 Bedroom', query: '1-bedroom', detail: 'A comfortable place to make your own.', marker: '02' },
  { name: '2 Bedroom', query: '2-bedroom', detail: 'Room to grow, share, or work from home.', marker: '03' },
  { name: '3 Bedroom', query: '3-bedroom', detail: 'Generous homes for family life and more.', marker: '04' },
]

export const locations = [
  { name: 'Nairobi', detail: 'City living' },
  { name: 'Kiambu', detail: 'Close to the city' },
  { name: 'Thika', detail: 'Growing community' },
  { name: 'Nakuru', detail: 'Rift Valley living' },
  { name: 'Mombasa', detail: 'Coastal homes' },
  { name: 'Eldoret', detail: 'Western Kenya' },
]

export const listingAmenities = ['Parking', 'Security', 'Water included', 'Furnished', 'Balcony', 'Near transport']

export const listingProperties = [
  { id: 'ruiru-garden-flat', title: 'Garden View Apartment', location: 'Ruiru, Kiambu', rent: 'KES 18,000', price: 18000, type: '1 Bedroom', typeKey: '1-bedroom', bedrooms: '1 bed', bedroomCount: 1, availability: 'Available now', amenities: ['Parking', 'Security', 'Water included'], image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80', createdAt: '2026-09-12' },
  { id: 'thika-modern-home', title: 'Modern Family Home', location: 'Thika, Kiambu', rent: 'KES 35,000', price: 35000, type: '3 Bedroom', typeKey: '3-bedroom', bedrooms: '3 beds', bedroomCount: 3, availability: 'Available now', amenities: ['Parking', 'Security', 'Balcony'], image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80', createdAt: '2026-09-10' },
  { id: 'kahawa-studio', title: 'Bright Studio Space', location: 'Kahawa, Nairobi', rent: 'KES 12,500', price: 12500, type: 'Bedsitter', typeKey: 'bedsitter', bedrooms: 'Studio', bedroomCount: 0, availability: 'Available now', amenities: ['Security', 'Near transport'], image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', createdAt: '2026-09-08' },
  { id: 'riverside-residence', title: 'Riverside Residence', location: 'Nairobi', rent: 'KES 28,000', price: 28000, type: '2 Bedroom', typeKey: '2-bedroom', bedrooms: '2 beds', bedroomCount: 2, availability: 'Viewing open', amenities: ['Parking', 'Security', 'Balcony'], image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80', createdAt: '2026-09-06' },
  { id: 'ruiru-terrace-home', title: 'Terrace Court Home', location: 'Ruiru, Kiambu', rent: 'KES 24,000', price: 24000, type: '2 Bedroom', typeKey: '2-bedroom', bedrooms: '2 beds', bedroomCount: 2, availability: 'Available now', amenities: ['Parking', 'Water included', 'Near transport'], image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80', createdAt: '2026-09-14' },
  { id: 'nakuru-courtyard-flat', title: 'Courtyard Apartment', location: 'Nakuru', rent: 'KES 16,000', price: 16000, type: '1 Bedroom', typeKey: '1-bedroom', bedrooms: '1 bed', bedroomCount: 1, availability: 'Available now', amenities: ['Parking', 'Water included'], image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80', createdAt: '2026-09-04' },
  { id: 'mombasa-coastal-flat', title: 'Coastal Breeze Flat', location: 'Mombasa', rent: 'KES 30,000', price: 30000, type: '2 Bedroom', typeKey: '2-bedroom', bedrooms: '2 beds', bedroomCount: 2, availability: 'Viewing open', amenities: ['Furnished', 'Security', 'Balcony'], image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80', createdAt: '2026-09-02' },
  { id: 'eldoret-garden-house', title: 'Quiet Garden House', location: 'Eldoret', rent: 'KES 22,000', price: 22000, type: '3 Bedroom', typeKey: '3-bedroom', bedrooms: '3 beds', bedroomCount: 3, availability: 'Available now', amenities: ['Parking', 'Security', 'Water included'], image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80', createdAt: '2026-08-30' },
  { id: 'kiambu-furnished-studio', title: 'Furnished Studio', location: 'Kiambu', rent: 'KES 15,500', price: 15500, type: 'Bedsitter', typeKey: 'bedsitter', bedrooms: 'Studio', bedroomCount: 0, availability: 'Available now', amenities: ['Furnished', 'Security', 'Near transport'], image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', createdAt: '2026-08-28' },
  { id: 'westlands-city-apartment', title: 'City Edge Apartment', location: 'Westlands, Nairobi', rent: 'KES 42,000', price: 42000, type: '1 Bedroom', typeKey: '1-bedroom', bedrooms: '1 bed', bedroomCount: 1, availability: 'Viewing open', amenities: ['Furnished', 'Security', 'Parking', 'Balcony'], image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498a?auto=format&fit=crop&w=900&q=80', createdAt: '2026-08-25' },
]

export const featuredProperties = listingProperties.slice(0, 4)
