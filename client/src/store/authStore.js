import { create } from 'zustand'
import { mockAccounts } from '../data/mockAccounts'

const normaliseEmail = (email) => email.trim().toLowerCase()
const validEmail = (email) => /^\S+@\S+\.\S+$/.test(email)
const toSessionUser = ({ password, ...account }) => account

const useAuthStore = create((set, get) => ({
  accounts: [...mockAccounts],
  user: null,
  loginWithEmail: (email, password) => {
    const account = get().accounts.find((item) => item.email === normaliseEmail(email))

    if (!account || account.password !== password) {
      set({ user: null })
      return { ok: false, message: 'The email or password you entered is incorrect.' }
    }

    const user = toSessionUser(account)
    set({ user })
    return { ok: true, user }
  },
  registerMockUser: ({ name, email, password, role }) => {
    const cleanName = name.trim()
    const cleanEmail = normaliseEmail(email)

    if (cleanName.length < 2) return { ok: false, message: 'Enter a name with at least 2 characters.' }
    if (!validEmail(cleanEmail)) return { ok: false, message: 'Enter a valid email address.' }
    if (password.length < 8) return { ok: false, message: 'Use a password with at least 8 characters.' }
    if (!['tenant', 'landlord'].includes(role)) return { ok: false, message: 'Choose a tenant or landlord account type.' }
    if (get().accounts.some((account) => account.email === cleanEmail)) return { ok: false, message: 'An account already exists for that email.' }

    const uniqueId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const account = { id: `mock-${role}-${uniqueId}`, name: cleanName, email: cleanEmail, password, role }
    set((state) => ({ accounts: [...state.accounts, account] }))
    return { ok: true, user: toSessionUser(account) }
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
