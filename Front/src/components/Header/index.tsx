import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { LogIn, LogOut, User as UserIcon, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../store/auth/useAuthStore";

const headerItems = [
  { label: "برنامه هفتگی", href: "/schedule" },
  { label: "درس ها", href: "/courses" },
  { label: "برنامه کلاس ها", href: "/classes" },
  { label: "اساتید", href: "/instructors?mode=department" },
  { label: "دپارتمان", href: "/departments" },
  { label: "داشبورد دانشگاه", href: "/" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const username = useAuthStore((s) => s.username);
  const role = useAuthStore((s) => s.role);
  const hydrate = useAuthStore((s) => s.hydrate);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!hasHydrated) hydrate();
  }, [hasHydrated, hydrate]);

  const isActive = (href: string) => {
    const hrefPath = href.split("?")[0];
    return location.pathname === hrefPath;
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/auth", {
      state: { from: location.pathname + location.search },
    });
  };

  const profileLink = role === "admin" ? "/admin" : "/profile";
  const profileLabel = role === "admin" ? "پنل مدیریت" : "پروفایل من";
  const ProfileIcon = role === "admin" ? ShieldCheck : UserIcon;
  const initial = username?.charAt(0)?.toUpperCase() || "؟";

  return (
    <header
      className="w-full bg-white shadow-md fixed top-0 right-0 z-50"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 hover:scale-105 transition-transform flex-shrink-0"
        >
          <img
            src="assets/icons/jaOstadiIcon.webp"
            className="w-10 h-10"
            alt="Ja Ostadi"
          />
          <p className="text-gray-800 font-bold text-lg hidden sm:block">
            جا استادی
          </p>
        </Link>

        <nav className="hidden md:flex gap-2 lg:gap-4 flex-1 justify-center">
          {headerItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700 shadow"
                  : "text-gray-700 hover:text-blue-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {!hasHydrated ? (
            <div className="w-24 h-9 bg-gray-100 rounded-lg animate-pulse" />
          ) : isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-2.5 py-1.5 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-[#AB8A58] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {initial}
                </span>
                <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
                  {username ?? "کاربر"}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden py-1">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">وارد شده با</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {username ?? "کاربر"}
                    </p>
                  </div>

                  <Link
                    to={profileLink}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ProfileIcon className="w-4 h-4 text-[#AB8A58]" />
                    {profileLabel}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    خروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLoginClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#AB8A58] hover:bg-[#96764A] text-white px-4 py-2 text-sm font-semibold transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              ورود
            </button>
          )}
        </div>

        <button
          ref={toggleButtonRef}
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
        </button>
      </div>

      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[600px] border-t" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4 gap-2 bg-white">
          {headerItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-2 pt-3 border-t border-gray-200">
            {!hasHydrated ? null : isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-4 py-3">
                  <span className="w-8 h-8 rounded-full bg-[#AB8A58] text-white flex items-center justify-center text-sm font-bold">
                    {initial}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">وارد شده با</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {username ?? "کاربر"}
                    </p>
                  </div>
                </div>
                <Link
                  to={profileLink}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <ProfileIcon className="w-4 h-4 text-[#AB8A58]" />
                  {profileLabel}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleLoginClick();
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#AB8A58] hover:bg-[#96764A] text-white px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                <LogIn className="w-4 h-4" />
                ورود به سیستم
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;