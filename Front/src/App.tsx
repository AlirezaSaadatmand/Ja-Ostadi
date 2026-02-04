import { RouterProvider } from "react-router-dom"
import { useEffect } from "react"
import { useAuthStore } from "./store/auth/useAuthStore"
import { router } from "./router"

const AppRoutes = () => {
  const { hydrateFromToken } = useAuthStore()

  useEffect(() => {
    hydrateFromToken()
  }, [hydrateFromToken])

  return <RouterProvider router={router} />
}

export default AppRoutes
