import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/auth/useAuthStore"
import { FcGoogle } from "react-icons/fc"

const GoogleLoginPage = () => {
  const navigate = useNavigate()
  const { loginWithGoogle, isLoading } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    if (token) {
      localStorage.setItem("jwt", token)
      window.history.replaceState({}, document.title, window.location.pathname)
      // fetchAuthStatus().then(() => {
      //   navigate("/")
      // })
    }
  }, [navigate])

  const goToLogin = () => {
    loginWithGoogle("/login")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">ورود با گوگل</h1>
        <p className="text-gray-500 mb-8">
          با حساب گوگل خود وارد شوید و به امکانات سایت دسترسی پیدا کنید
        </p>
        <button
          onClick={goToLogin}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 w-full px-5 py-3 border border-gray-300 rounded-lg hover:shadow-lg hover:bg-gray-50 transition"
        >
          {isLoading ? (
            <span className="text-gray-700 font-medium">در حال هدایت...</span>
          ) : (
            <>
              <FcGoogle size={24} />
              <span className="text-gray-800 font-medium">ورود با گوگل</span>
            </>
          )}
        </button>

      </div>
    </div>
  )
}

export default GoogleLoginPage
