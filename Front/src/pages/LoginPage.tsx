import type React from "react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Lock, User, Eye, EyeOff } from "lucide-react"
import { useAuthStore } from "../store/auth/useAuthStore"
import Header from "../components/Header"
import ContributorsSection from "../components/Contributors/ContributorsSection"

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()

  const location = useLocation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim() || !password.trim()) {
      setError("نام کاربری و رمز عبور را وارد کنید")
      return
    }

    try {
      const payload = await login(username, password)
      const redirectTo = location.state?.from ?? (payload.role === "director" ? "/directors" : "/")

      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ورود")
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative"
      dir="rtl"
    >
      <Header />
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <ContributorsSection />
      </div>

      <div className="w-full max-w-md mt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            ورود به داشبورد جا استادی
          </h1>
          <p className="text-gray-600">
            لطفا اطلاعات حساب کاربری خود را وارد کنید
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        >
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              نام کاربری
            </label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB8A58]"
                dir="ltr"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              رمز عبور
            </label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB8A58]"
                dir="ltr"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#AB8A58] text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "در حال ورود..." : "ورود به سیستم"}
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              برای دسترسی به این بخش نیاز به حساب مدیریت دارید
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
