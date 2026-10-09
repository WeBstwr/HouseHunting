import { create } from 'zustand'

export const mockUsers = {
  tenant: { id: 'mock-tenant-1', role: 'tenant', name: 'Mock Tenant' },
  landlord: { id: 'mock-landlord-1', role: 'landlord', name: 'Mock Landlord' },
}

const useAuthStore = create((set, get) => ({
  user: null,
  loginAsTenant: () => set({ user: mockUsers.tenant }),
  loginAsLandlord: () => set({ user: mockUsers.landlord }),
  logout: () => set({ user: null }),
  isAuthenticated: () => Boolean(get().user),
  hasRole: (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles]
    return Boolean(get().user && allowedRoles.includes(get().user.role))
  },
}))

export default useAuthStore
