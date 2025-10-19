import { useLocation } from "react-router-dom";

const headerItems = [
  { label: "برنامه هفتگی", href: "/schedule" },
  { label: "دپارتمان", href: "/departments" },
  { label: "اساتید", href: "/instructors?mode=department" },
  { label: "دروس", href: "/courses" },
  { label: "چی داریم!", href: "/food" },
  { label: "داشبورد دانشگاه", href: "/" },
];

const Header = () => {
  const location = useLocation();

  const isActive = (href: string) => {
    const hrefPath = href.split("?")[0];
    return location.pathname === hrefPath;
  };

  return (
    <header
      className="w-full bg-white shadow-md py-6  justify-center gap-12 items-center absolute md:top-0 sm:right-0 z-10 hidden sm:flex"
      dir="rtl"
    >
      <a
        href="/"
        className="flex items-center gap-3 cursor-pointer delay-100 hover:scale-105 transition-transform"
      >
        <img
          src="assets/icons/jaOstadiIcon.webp"
          className="w-12 h-12"
          alt="Ja Ostadi"
        />
        <p className="text-gray-800 hover:text-blue-900 mx-2 font-bold text-xl">
          جا استادی
        </p>
      </a>

      <nav className="flex gap-6">
        {headerItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`relative px-5 py-3 rounded-lg text-base font-semibold transition-all duration-300 ${
              isActive(item.href)
                ? "bg-blue-50 text-blue-700 shadow"
                : "text-gray-700 hover:text-blue-700 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
