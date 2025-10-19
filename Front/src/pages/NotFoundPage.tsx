import type React from "react"

const notFoundMessages = [
  'اخخخ رفتی تو دیوار که :)',
  'بَد شد که :/',
  'یا خودش میاد یا خبرش ... فعلا که خبری ازش نی',
  'به کاه‌دون زدی مهندس',
  'فععک نکنم این صفحه وجود داشته باشه'
];

const NotFoundPage: React.FC = () => {
  const giveOneToMe = Math.floor(Math.random() * notFoundMessages.length);
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-8 font-sans text-center"
      dir="rtl"
    >
      <h1 className="text-[10rem] font-extrabold text-indigo-600 mb-8">۴۰۴</h1>
      <h2 className="text-4xl font-bold mb-4 text-gray-900">صفحه مورد نظر یافت نشد</h2>
      <p className="text-gray-700 text-base mb-8 max-w-md">
       {notFoundMessages[giveOneToMe]}
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
