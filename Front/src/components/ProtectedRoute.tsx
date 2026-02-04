import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/auth/useAuthStore"

interface Props {
  children: React.ReactNode
  role?: string
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { isAuthenticated, user, hasHydrated } = useAuthStore()
  const location = useLocation()

  // ⛔ wait until auth is hydrated
  if (!hasHydrated) {
    return null // or loading spinner
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
