import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Book, LogOut, Shield, Calendar, BookOpen, Building2 } from "lucide-react"
import { useAuthStore } from "../../store/auth/useAuthStore"
import Header from "../../components/Header"
import ContributorsSection from "../../components/Contributors/ContributorsSection"

const DirectorsPage: React.FC = () => {
  const { user, isAuthenticated, hasHydrated, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!hasHydrated) return

    if (!isAuthenticated) {
      navigate("/login", { replace: true })
      return
    }

    if (user?.role !== "director") {
      navigate("/", { replace: true })
      return
    }
  }, [hasHydrated, isAuthenticated, user, navigate])

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  const adminActions = [
    {
      title: "افزودن درس جدید",
      description: "اضافه کردن درس برای ترم جدید",
      icon: <Book className="w-8 h-8 text-[#AB8A58]" />,
      link: "/instructors",
      color: "bg-blue-50 hover:bg-blue-100",
    },
    {
      title: "ویرایش درس",
      description: "ویرایش و مدیریت دروس",
      icon: <BookOpen className="w-8 h-8 text-[#AB8A58]" />,
      link: "/courses",
      color: "bg-green-50 hover:bg-green-100",
    },
    {
      title: "مدیریت دپارتمان‌ها",
      description: "ویرایش اطلاعات دپارتمان‌ها",
      icon: <Building2 className="w-8 h-8 text-[#AB8A58]" />,
      link: "/departments",
      color: "bg-purple-50 hover:bg-purple-100",
    },
    {
      title: "برنامه هفتگی",
      description: "تنظیم برنامه هفتگی دروس",
      icon: <Calendar className="w-8 h-8 text-[#AB8A58]" />,
      link: "/schedule",
      color: "bg-yellow-50 hover:bg-yellow-100",
    },
  ]

  if (!hasHydrated) return null

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center p-4 sm:p-8 font-sans relative"
      dir="rtl"
    >
      <Header />
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <ContributorsSection />
      </div>

      <div className="w-full max-w-7xl mt-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#AB8A58]/10 rounded-xl">
                <Shield className="w-10 h-10 text-[#AB8A58]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  پنل مدیر گروه
                </h1>
                <p className="text-gray-600 mt-1">
                  خوش آمدید، {user?.username}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              خروج
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-6">
          عملیات مدیریتی
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action) => (
            <a
              key={action.title}
              href={action.link}
              className={`${action.color} rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">{action.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DirectorsPage
