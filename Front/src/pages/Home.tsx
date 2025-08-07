import type React from "react"
import { Building2 } from 'lucide-react'

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
    // {
    //   title: "دروس",
    //   description: "مشاهده و مدیریت دروس ارائه شده.",
    //   icon: (
    //     <svg
    //       className="w-12 h-12 text-yellow-600"
    //       fill="none"
    //       stroke="currentColor"
    //       strokeWidth={2}
    //       viewBox="0 0 24 24"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //     >
    //       <path d="M12 20h9" />
    //       <path d="M12 4h9" />
    //       <path d="M4 12h16" />
    //       <path d="M4 12l5-8v16l-5-8z" />
    //     </svg>
    //   ),
    //   link: "/courses",
    // },
  ]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-8 font-sans"
      dir="rtl"
    >
      <h1 className="text-6xl font-extrabold mb-12 text-gray-900 text-center">خوش آمدید به داشبورد دانشگاه شما</h1>
      <p className="max-w-xl mb-10 text-center text-gray-600 text-xl">
        در ترم‌ها، دپارتمان‌ها، اساتید و دروس حرکت کنید. برای شروع روی هر بخش کلیک کنید.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
        {sections.map(({ title, description, icon, link }) => (
          <a
            key={title}
            href={link}
            className="group bg-white rounded-xl shadow-lg p-10 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <div className="mb-6">{icon}</div>
            <h2 className="text-2xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors duration-300">
              {title}
            </h2>
            <p className="text-gray-600 text-base">{description}</p>
            <span className="mt-6 inline-block text-indigo-600 group-hover:underline font-semibold">مشاهده →</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default HomePage
