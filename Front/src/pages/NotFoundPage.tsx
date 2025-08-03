import type React from "react"

const NotFoundPage: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-8 font-sans text-center"
      dir="rtl"
    >
      <h1 className="text-[10rem] font-extrabold text-indigo-600 mb-8">۴۰۴</h1>
      <h2 className="text-4xl font-bold mb-4 text-gray-900">صفحه مورد نظر یافت نشد</h2>
      <p className="text-gray-700 text-base mb-8 max-w-md">
        اوپس! صفحه‌ای که به دنبال آن بودید وجود ندارد یا منتقل شده است.
      </p>
      <a
        href="/"
        className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
      >
        بازگشت به صفحه اصلی
      </a>
    </div>
  )
}

export default NotFoundPage
