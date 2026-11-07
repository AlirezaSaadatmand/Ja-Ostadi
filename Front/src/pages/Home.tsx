import {
  ArrowLeft,
  ArrowUpLeft,
  BookA,
  BookOpen,
  Building2,
  CalendarDays,
  GraduationCap,
  Info,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import config from "../config/config";

type HomeSection = {
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  href?: string;
  tone: "indigo" | "amber" | "emerald" | "sky" | "rose" | "violet";
  comingSoon?: boolean;
};

const sections: HomeSection[] = [
  {
    title: "برنامه هفتگی",
    description: "برنامه درسی را مشاهده و برای هفته پیش رو برنامه‌ریزی کنید.",
    category: "برنامه‌ریزی",
    icon: CalendarDays,
    href: "/schedule",
    tone: "indigo",
  },
  {
    title: "درس‌ها",
    description: "درس‌های ارائه‌شده را جست‌وجو و جزئیات آن‌ها را بررسی کنید.",
    category: "آموزش",
    icon: BookOpen,
    href: "/courses",
    tone: "amber",
  },
  {
    title: "برنامه کلاس‌ها",
    description: "زمان و محل برگزاری کلاس‌ها را پیدا کنید.",
    category: "دانشگاه",
    icon: GraduationCap,
    href: "/classes",
    tone: "emerald",
  },
  {
    title: "اساتید",
    description: "اطلاعات استادان و درس‌های مرتبط را مشاهده کنید.",
    category: "راهنما",
    icon: GraduationCap,
    href: "/instructors",
    tone: "sky",
  },
  {
    title: "دپارتمان‌ها",
    description: "با دپارتمان‌های علمی دانشگاه آشنا شوید.",
    category: "دانشگاه",
    icon: Building2,
    href: "/departments",
    tone: "rose",
  },
  {
    title: "محتوای آموزشی",
    description: "به منابع یادگیری و مطالب آموزشی دسترسی داشته باشید.",
    category: "یادگیری",
    icon: BookA,
    href: "/learning-hub",
    tone: "violet",
  },
  {
    title: "اطلاعات دانشجویی",
    description: "نکته‌ها و اطلاعات کاربردی برای زندگی دانشجویی.",
    category: "راهنما",
    icon: Info,
    tone: "sky",
    comingSoon: true,
  },
  {
    title: "غذای دانشگاه",
    description: "اطلاعات و برنامه هفتگی غذای دانشگاه.",
    category: "دانشگاه",
    icon: UtensilsCrossed,
    href: "/food",
    tone: "emerald",
    comingSoon: true,
  },
];

const toneStyles = {
  indigo: {
    icon: "bg-indigo-100 text-indigo-700",
    accent: "bg-indigo-500",
    category: "text-indigo-700",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700",
    accent: "bg-amber-500",
    category: "text-amber-700",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-700",
    accent: "bg-emerald-500",
    category: "text-emerald-700",
  },
  sky: {
    icon: "bg-sky-100 text-sky-700",
    accent: "bg-sky-500",
    category: "text-sky-700",
  },
  rose: {
    icon: "bg-rose-100 text-rose-700",
    accent: "bg-rose-500",
    category: "text-rose-700",
  },
  violet: {
    icon: "bg-violet-100 text-violet-700",
    accent: "bg-violet-500",
    category: "text-violet-700",
  },
};

const CampusIllustration = () => (
  <svg
    viewBox="0 0 420 320"
    role="img"
    aria-label="نمایی از ساختمان دانشگاه و کتاب‌ها"
    className="h-auto w-full max-w-[25rem]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="campus-building" x1="140" y1="75" x2="285" y2="265">
        <stop stopColor="#FFFDF8" />
        <stop offset="1" stopColor="#F4EBDD" />
      </linearGradient>
      <linearGradient id="campus-book-cover" x1="115" y1="252" x2="320" y2="304">
        <stop stopColor="#E6AD59" />
        <stop offset=".5" stopColor="#FFE7AE" />
        <stop offset="1" stopColor="#D99442" />
      </linearGradient>
    </defs>
    <circle cx="210" cy="158" r="132" fill="#E9EAFE" />
    <circle cx="210" cy="158" r="108" fill="#F4F4FF" />
    <path d="M75 259c38-19 82-29 135-29s97 10 135 29v20H75v-20Z" fill="#D9DDF7" />
    <path d="m122 124 88-61 88 61-12 17H134l-12-17Z" fill="#D7A45C" />
    <path d="m139 121 71-49 71 49H139Z" fill="#F6D99F" />
    <path d="M140 139h140v111H140z" fill="url(#campus-building)" />
    <path d="M127 250h166v13H127z" fill="#D5B47E" />
    <path d="M164 151h15v86h-15zM202 151h15v86h-15zM240 151h15v86h-15z" fill="#C79B57" />
    <path d="M218 200c0-17 12-30 27-30s27 13 27 30v37h-54v-37Z" fill="#777BAF" />
    <path d="M232 211h26v26h-26z" fill="#555A91" />
    <path d="M151 135h118" stroke="#FFFDF8" strokeWidth="5" />
    <path d="M104 265h106v41H104z" fill="url(#campus-book-cover)" />
    <path d="M210 265h106v41H210z" fill="#F7D69A" />
    <path d="M210 266v40" stroke="#C4934D" strokeWidth="3" />
    <path d="m106 265 104-15 104 15-104 18-104-18Z" fill="#FFF6E5" />
    <path d="m210 250 104 15-104 18v-33Z" fill="#F0D8AD" />
    <path d="M96 197c-14-20-13-39 1-56 12 16 13 35-1 56Zm0 0c-19-8-29-22-28-39 20 5 31 19 28 39Z" fill="#70B99B" />
    <path d="m97 199 1 43" stroke="#A47746" strokeLinecap="round" strokeWidth="6" />
    <path d="M325 181c-14-20-13-39 1-56 12 16 13 35-1 56Zm0 0c-19-8-29-22-28-39 20 5 31 19 28 39Z" fill="#70B99B" />
    <path d="m326 183 1 59" stroke="#A47746" strokeLinecap="round" strokeWidth="6" />
    <path d="m327 70 5 11 12 2-9 8 3 12-11-6-10 6 2-12-8-8 12-2 4-11Z" fill="#E6B75D" />
    <circle cx="108" cy="85" r="5" fill="#E6B75D" />
    <circle cx="315" cy="226" r="4" fill="#A4A7D3" />
  </svg>
);

const HomePage = () => (
  <div className="min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-900" dir="rtl">
    <Header />

    <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white shadow-[0_16px_50px_rgba(35,42,87,0.08)] sm:rounded-[2rem]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-indigo-600 via-violet-500 to-amber-400" />
        <div className="grid items-center gap-5 p-5 sm:gap-8 sm:p-8 xl:grid-cols-2 xl:gap-12 xl:p-12">
          <div className="order-1 min-w-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700">
              <Sparkles className="h-4 w-4" />
              راهنمای دانشگاه فسا
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.55] tracking-tight text-slate-900 sm:text-4xl xl:text-[2.75rem]">
              اطلاعات دانشگاه،
              <span className="block text-indigo-700">یک‌جا و در دسترس</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              برنامه هفتگی، درس‌ها و اطلاعات استادان را در یک محیط ساده و
              یکپارچه دنبال کنید.
            </p>

            <div className="mt-7 flex flex-col gap-3 min-[440px]:flex-row min-[440px]:flex-wrap">
              <Link
                to="/schedule"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white shadow-md shadow-indigo-700/15 transition hover:-translate-y-0.5 hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 motion-reduce:transform-none"
              >
                مشاهده برنامه هفتگی
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              >
                مشاهده درس‌ها
                <ArrowUpLeft className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-indigo-600" />
                برنامه‌ریزی آسان‌تر
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-600" />
                دسترسی سریع به اطلاعات
              </span>
            </div>
          </div>

          <div className="order-2 flex min-w-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-amber-50 px-3 py-5 sm:rounded-3xl sm:px-6 sm:py-7 xl:min-h-[22rem]">
            <CampusIllustration />
          </div>
        </div>
      </section>

      <section className="mt-12 sm:mt-16" aria-labelledby="sections-heading">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold text-indigo-700">بخش‌های سایت</p>
            <h2
              id="sections-heading"
              className="text-2xl font-extrabold text-slate-900 sm:text-3xl"
            >
              خدمات جا استادی
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            بخش موردنظر را انتخاب کنید تا به اطلاعات مربوط دسترسی داشته باشید.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          {sections.map(
            ({ title, description, category, icon: Icon, href, tone, comingSoon }) => {
              const style = toneStyles[tone];
              const cardContent = (
                <>
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    {comingSoon ? (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                        به‌زودی
                      </span>
                    ) : (
                      <span
                        className={`mt-2 h-1.5 w-10 rounded-full ${style.accent}`}
                      />
                    )}
                  </div>
                  <p className={`text-xs font-bold ${style.category}`}>{category}</p>
                  <h3 className="mt-1.5 text-lg font-bold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                  {!comingSoon && (
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-700 transition group-hover:gap-2.5">
                      ورود به بخش
                      <ArrowLeft className="h-4 w-4" />
                    </span>
                  )}
                </>
              );
              const cardClassName = `group flex min-h-56 flex-col rounded-2xl border bg-white p-5 transition duration-200 sm:p-6 ${
                comingSoon
                  ? "border-slate-200 opacity-75"
                  : "border-slate-200 shadow-[0_4px_14px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_14px_32px_rgba(49,46,129,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 motion-reduce:transform-none"
              }`;

              return href && !comingSoon ? (
                <Link key={title} to={href} className={cardClassName}>
                  {cardContent}
                </Link>
              ) : (
                <div key={title} className={cardClassName} aria-disabled="true">
                  {cardContent}
                </div>
              );
            },
          )}
        </div>
      </section>

      <footer className="mt-12 border-t border-slate-200 py-6 sm:mt-16">
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-right">
          <p className="text-sm text-slate-500">
            جا استادی؛ راهی ساده برای دسترسی به اطلاعات دانشگاهی.
          </p>
          <a
            href={
              config.projectUrl ||
              "https://github.com/AlirezaSaadatmand/Ja-Ostadi"
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label="مشاهده پروژه جا استادی در گیت‌هاب"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span>پروژه در گیت‌هاب</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.14 1.68 1.14.98 1.68 2.58 1.2 3.2.92.1-.72.39-1.2.7-1.48-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.1-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.29-2.61 5.23-5.1 5.5.4.35.74 1.02.74 2.06v3.05c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
            </svg>
          </a>
        </div>
      </footer>
    </main>
  </div>
);

export default HomePage;
