import type React from "react"
import { Building2 } from "lucide-react"
import { BookOpen } from "lucide-react"
import ContributorsSection from "../components/Contributors/ContributorsSection"

const HomePage: React.FC = () => {
  const sections = [
    {
      title: "برنامه هفتگی",
      description: "مشاهده و تنظیم برنامه هفتگی دروس.",
      icon: (
        <svg
          className="w-12 h-12 text-indigo-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      link: "/schedule",
    },
    {
      title: "دپارتمان‌ها",
      description: "کاوش در دپارتمان‌های علمی مختلف.",
      icon: <Building2 className="w-12 h-12 text-green-600" />,
      link: "/departments",
    },
    {
      title: "اساتید",
      description: "جزئیات درباره اساتید.",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21h13a2 2 0 002-2v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1a2 2 0 002 2z" />
        </svg>
      ),
      link: "/instructors",
    },
    {
      title: "دروس",
      description: "مشاهده و مدیریت دروس ارائه شده.",
      icon: <BookOpen className="w-12 h-12 text-emerald-600" />,
      link: "/courses",
    },
  ]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative"
      dir="rtl"
    >
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <ContributorsSection />
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 sm:mb-12 text-gray-900 text-center px-4">
        داشبورد دانشگاه
      </h1>

      <p className="max-w-xl mb-8 sm:mb-10 text-center text-gray-600 text-base sm:text-lg md:text-xl px-4">
        از بخش های پایین می تونی به قسمت های مختلف دسترسی داشته باشی.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl w-full mb-8 sm:mb-12 px-4">
        {sections.map(({ title, description, icon, link }) => (
          <a
            key={title}
            href={link}
            className="group bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <div className="mb-4 sm:mb-6">{icon}</div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors duration-300">
              {title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">{description}</p>
            <span className="mt-4 sm:mt-6 inline-block text-indigo-600 group-hover:underline font-semibold text-sm sm:text-base">
              مشاهده →
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default HomePage
