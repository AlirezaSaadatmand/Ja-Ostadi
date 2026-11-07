import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  GraduationCap,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  User as UserIcon,
  X,
} from "lucide-react";
import { useAuthStore } from "../../store/auth/useAuthStore";

const headerItems = [
  { label: "برنامه هفتگی", href: "/schedule" },
  { label: "درس‌ها", href: "/courses" },
  { label: "برنامه کلاس‌ها", href: "/classes" },
  { label: "استادان", href: "/instructors?mode=department" },
  { label: "دپارتمان‌ها", href: "/departments" },
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

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const renderAuthControl = (mobile = false) => {
    if (!hasHydrated) {
      return mobile ? null : (
        <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
      );
    }

    if (!isAuthenticated) {
      return (
        <button
          type="button"
          onClick={() => {
            if (mobile) setMenuOpen(false);
            handleLoginClick();
          }}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 ${
            mobile ? "w-full px-4 py-3 text-sm" : "px-4 py-2.5 text-sm"
          }`}
        >
          <LogIn className="h-4 w-4" />
          ورود به سامانه
        </button>
      );
    }

    if (mobile) {
      return (
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">واردشده با</p>
              <p className="truncate text-sm font-semibold text-slate-800">
                {username ?? "کاربر"}
              </p>
            </div>
          </div>
          <Link
            to={profileLink}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ProfileIcon className="h-4 w-4 text-indigo-600" />
            {profileLabel}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>
      );
    }

    return (
      <div className="relative" ref={userMenuRef}>
        <button
          type="button"
          onClick={() => setUserMenuOpen((open) => !open)}
          aria-expanded={userMenuOpen}
          className="inline-flex max-w-48 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 transition hover:border-indigo-200 hover:bg-indigo-50/50"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            {initial}
          </span>
          <span className="max-w-28 truncate text-sm font-semibold text-slate-700">
            {username ?? "کاربر"}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        </button>

        {userMenuOpen && (
          <div className="absolute left-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white py-1 shadow-xl shadow-slate-900/10">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-xs text-slate-500">واردشده با</p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                {username ?? "کاربر"}
              </p>
            </div>
            <Link
              to={profileLink}
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <ProfileIcon className="h-4 w-4 text-indigo-600" />
              {profileLabel}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_4px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl"
      dir="rtl"
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 xl:h-24 xl:px-8">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 sm:gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-700 to-violet-600 text-white shadow-md shadow-indigo-700/20 sm:h-12 sm:w-12 xl:h-14 xl:w-14">
            <GraduationCap
              aria-hidden="true"
              className="h-6 w-6 sm:h-7 sm:w-7 xl:h-8 xl:w-8"
              strokeWidth={1.8}
            />
          </span>
          <span className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg xl:text-xl">
            جا استادی
          </span>
        </Link>

        <nav
          aria-label="ناوبری اصلی"
          className="hidden items-center gap-0.5 rounded-2xl bg-slate-50 p-1 xl:flex"
        >
          {headerItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`whitespace-nowrap rounded-xl px-2.5 py-2 text-[13px] font-semibold transition xl:px-3 ${
                isActive(item.href)
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:bg-white/80 hover:text-indigo-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/"
            aria-current={isActive("/") ? "page" : undefined}
            className={`whitespace-nowrap rounded-xl px-2.5 py-2 text-[13px] font-semibold transition xl:px-3 ${
              isActive("/")
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:bg-white/80 hover:text-indigo-700"
            }`}
          >
            خانه
          </Link>
        </nav>

        <div className="hidden shrink-0 xl:block">{renderAuthControl()}</div>

        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "بستن فهرست" : "باز کردن فهرست"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 xl:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        ref={menuRef}
        className={`overflow-hidden border-t border-slate-100 bg-white transition-[max-height,opacity] duration-300 xl:hidden ${
          menuOpen
            ? "max-h-[36rem] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav
          aria-label="ناوبری موبایل"
          className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6"
        >
          {headerItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                isActive(item.href)
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-700"
              }`}
            >
              {item.label}
              <ArrowLeft className="h-4 w-4 opacity-50" />
            </Link>
          ))}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            aria-current={isActive("/") ? "page" : undefined}
            className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
              isActive("/")
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-700"
            }`}
          >
            خانه
            <ArrowLeft className="h-4 w-4 opacity-50" />
          </Link>
          <div className="mt-2 border-t border-slate-100 pt-3">
            {renderAuthControl(true)}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
