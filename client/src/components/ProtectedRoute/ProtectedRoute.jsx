import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/listings" replace />
  }

  return children
}

export default ProtectedRoute
