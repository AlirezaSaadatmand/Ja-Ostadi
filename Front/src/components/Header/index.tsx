import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const headerItems = [
  { label: "برنامه هفتگی", href: "/schedule" },
  { label: "دروس", href: "/courses" },
  { label: "برنامه کلاس ها", href: "/classes" },
  { label: "اساتید", href: "/instructors?mode=department" },
  { label: "دپارتمان", href: "/departments" },
  { label: "داشبورد دانشگاه", href: "/" },
];

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const isActive = (href: string) => {
    const hrefPath = href.split("?")[0];
    return location.pathname === hrefPath;
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header
      className="w-full bg-white shadow-md fixed top-0 right-0 z-50"
      dir="rtl"
    >
      {/* Top bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-3 hover:scale-105 transition-transform"
        >
          <img
            src="assets/icons/jaOstadiIcon.webp"
            className="w-10 h-10"
            alt="Ja Ostadi"
          />
          <p className="text-gray-800 font-bold text-lg">
            جا استادی
          </p>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4">
          {headerItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700 shadow"
                  : "text-gray-700 hover:text-blue-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[500px] border-t" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4 gap-2 bg-white">
          {headerItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
