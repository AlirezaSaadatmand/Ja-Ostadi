import type React from "react"
import { Building2, BookOpen, Info, UtensilsCrossed } from "lucide-react"
import ContributorsSection from "../components/Contributors/ContributorsSection"
import Header from "../components/Header"

const HomePage: React.FC = () => {
  const sections = [
    {
      title: "برنامه هفتگی",
      description: "مشاهده و تنظیم برنامه هفتگی دروس.",
      icon: (
        <svg
          className="w-12 h-12 text-[#AB8A58]"
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
      icon: <Building2 className="w-12 h-12 text-[#AB8A58]" />,
      link: "/departments",
    },
    {
      title: "اساتید",
      description: "جزئیات درباره اساتید.",
      icon: (
        <svg
          className="w-12 h-12 text-[#AB8A58]"
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
      icon: <BookOpen className="w-12 h-12 text-[#AB8A58]" />,
      link: "/courses",
    },
    {
      title: "اطلاعات بدرد بخور",
      description: "نکات و اطلاعات مفید برای دانشجوها.",
      icon: <Info className="w-12 h-12 text-[#AB8A58]" />,
      comingSoon: true,
    },
    {
      title: "سلف",
      description: "اطلاعات و برنامه هفتگی کالینان دانشگاه.",
      icon: <UtensilsCrossed className="w-12 h-12 text-[#AB8A58]" />,
      link: "/food"
    },
  ]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative"
      dir="rtl"
    >
      <Header />
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <ContributorsSection />
      </div>

      <h1 className="text-3xl  sm:text-4xl pt-20 md:text-5xl lg:text-6xl font-extrabold mb-8 sm:mb-12 text-gray-900 text-center px-4">
        داشبورد جا استادی!
      </h1>

      <p className="max-w-xl mb-8 sm:mb-10 text-center text-gray-600 text-base sm:text-lg md:text-xl px-4">
        از بخش های پایین می تونی به قسمت های مختلف دسترسی داشته باشی.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl w-full mb-8 sm:mb-12 px-4">
        {sections.map(({ title, description, icon, link, comingSoon }) => {
          const Wrapper: React.ElementType = comingSoon ? "div" : "a"

          return (
            <Wrapper
              key={title}
              {...(!comingSoon && { href: link })}
              className={`group bg-white rounded-xl shadow-md flex flex-col items-center text-center transition-shadow duration-300 relative ${
                comingSoon
                  ? "p-6 sm:p-8 lg:p-10 cursor-not-allowed opacity-70"
                  : "p-6 sm:p-8 lg:p-5 hover:shadow-xl hover:bg-gray-50 cursor-pointer"
              }`}
            >
              {comingSoon && (
                <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full">
                  به زودی
                </span>
              )}
              <div className="mb-4 sm:mb-6">{icon}</div>
              <h2 className="text-lg sm:text-xl lg:text-base font-semibold mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                {title}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-sm">
                {description}
              </p>
              {!comingSoon && (
                <span className="mt-4 sm:mt-6 inline-block text-indigo-600 group-hover:underline font-semibold text-sm sm:text-base lg:text-sm">
                  مشاهده →
                </span>
              )}
            </Wrapper>
          )
        })}

      </div>
    </div>
  )
}

export default HomePage
