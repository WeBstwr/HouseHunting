import { create } from 'zustand'
import { mockAccounts } from '../data/mockAccounts'

const normaliseEmail = (email) => email.trim().toLowerCase()
const validEmail = (email) => /^\S+@\S+\.\S+$/.test(email)

const useAuthStore = create((set, get) => ({
  accounts: [...mockAccounts],
  user: null,
  loginWithEmail: (email) => {
    const account = get().accounts.find((item) => item.email === normaliseEmail(email))

    if (!account) {
      set({ user: null })
      return { ok: false, message: 'That email is not a demo account. Register a tenant or landlord account to continue.' }
    }

    set({ user: account })
    return { ok: true, user: account }
  },
  registerMockUser: ({ name, email, role }) => {
    const cleanName = name.trim()
    const cleanEmail = normaliseEmail(email)

    if (cleanName.length < 2) return { ok: false, message: 'Enter a name with at least 2 characters.' }
    if (!validEmail(cleanEmail)) return { ok: false, message: 'Enter a valid email address.' }
    if (!['tenant', 'landlord'].includes(role)) return { ok: false, message: 'Choose a tenant or landlord account type.' }
    if (get().accounts.some((account) => account.email === cleanEmail)) return { ok: false, message: 'An account already exists for that email.' }

    const uniqueId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const user = { id: `mock-${role}-${uniqueId}`, name: cleanName, email: cleanEmail, role }
    set((state) => ({ accounts: [...state.accounts, user], user }))
    return { ok: true, user }
  },
  logout: () => set({ user: null }),
  isAuthenticated: () => Boolean(get().user),
  hasRole: (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles]
    return Boolean(get().user && allowedRoles.includes(get().user.role))
  },
  canManageProperty: (property) => {
    const user = get().user
    if (!user || !property) return false
    if (user.role === 'landlord') return property.ownerId === user.id
    if (user.role === 'agent') return property.managedByAgentIds?.includes(user.id) || false
    return false
  },
}))

export default useAuthStore
