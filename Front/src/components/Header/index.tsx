const headerItems = [
    { label: 'برنامه هفتگی', href: '/schedule' },
    { label: 'دپارتمان', href: '/departments' },
    { label: 'استاید', href: '/instructors?mode=department' },
    { label: 'دروس', href: '/courses' },
    { label: 'داشبورد دانشگاه', href: '/' },
]

const Header = () => {
  return (
    <header className="w-full bg-white shadow-md py-5 flex justify-center gap-10 items-center absolute md:top-0 sm:right-0 z-10 hidden sm:flex" dir="rtl">
        <a href="/" className="flex items-center gap-2 cursor-pointer delay-100 hover:scale-105 transition-transform">
            <img src="assets/icons/jaOstadiIcon.webp" className="w-10 h-10" alt="Ja Ostadi" />
            <p className="text-gray-700 hover:text-blue-900 mx-2 font-bold">جا استادی</p>
        </a>
        {
            headerItems.map((item) => (
                <a key={item.href} href={item.href} className="delay-100 hover:scale-105 transition-transform text-gray-700 hover:text-blue-900 mx-2">
                    {item.label}
                </a>
            ))            
        }
    </header>
  )
}
export default Header;
