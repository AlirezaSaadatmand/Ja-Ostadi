import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Eye,
  EyeOff,
  GraduationCap,
  LogIn,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useAuthStore } from "../store/auth/useAuthStore";
import Header from "../components/Header";
import config from "../config/config";

type Tab = "login" | "register";

interface LocationState {
  from?: string;
  tab?: Tab;
  message?: string;
}

export default function AuthPage({
  initialTab = "login",
}: {
  initialTab?: Tab;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, register, isLoading, isAuthenticated, role, checkAuthStatus } =
    useAuthStore();

  const state = (location.state ?? {}) as LocationState;
  const from = state.from ?? "/";

  const [tab, setTab] = useState<Tab>(state.tab ?? initialTab);
  const [formError, setFormError] = useState<string | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);

  useEffect(() => {
    if (state.message) toast.success(state.message);
  }, [state.message]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (role === null) {
      if (isLoading) return;
      void checkAuthStatus();
      return;
    }

    const destination =
      role === "admin"
        ? "/admin"
        : from && from !== "/" && from !== "/auth"
          ? from
          : "/profile";
    navigate(destination, { replace: true });
  }, [isAuthenticated, role, isLoading, from, navigate, checkAuthStatus]);

  const switchTab = (next: Tab) => {
    if (next === tab) return;
    setFormError(null);
    setTab(next);
  };

  const onSubmitLogin = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!loginUsername.trim() || !loginPassword) {
      setFormError("نام کاربری و رمز عبور الزامی است");
      return;
    }

    try {
      await login(loginUsername.trim(), loginPassword);
      toast.success("خوش برگشتی!");
    } catch {
      const errorMessage = useAuthStore.getState().error ?? "ورود ناموفق بود";
      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const onSubmitRegister = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const username = regUsername.trim();
    if (username.length < 3 || username.length > 32) {
      setFormError("نام کاربری باید بین ۳ تا ۳۲ کاراکتر باشد");
      return;
    }
    if (regPassword.length < 8) {
      setFormError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

    try {
      const result = await register(username, regPassword);

      if (result === "created_needs_login") {
        setLoginUsername(username);
        setLoginPassword("");
        setRegUsername("");
        setRegPassword("");
        setTab("login");
        toast.success("حساب ساخته شد — لطفاً وارد شو");
        return;
      }

      toast.success("حساب ساخته شد!");
    } catch {
      const errorMessage =
        useAuthStore.getState().error ?? "ثبت‌نام ناموفق بود";
      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const inputClass =
    "min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60";

  const submitClass =
    "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 font-bold text-white shadow-md shadow-indigo-700/15 transition hover:-translate-y-0.5 hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transform-none";

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-900"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-36 -top-40 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -bottom-48 -left-36 h-[28rem] w-[28rem] rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <Header />

      <main className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <section
          className="order-1 min-w-0 lg:order-2"
          aria-labelledby="auth-title"
        >
          <div className="mb-6 text-center lg:mb-8 lg:text-right">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-2 text-sm font-bold text-indigo-700">
              <Sparkles className="h-4 w-4" />
              دانشگاه فسا
            </span>
            <h1
              id="auth-title"
              className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl"
            >
              {tab === "login" ? (
                <>
                  خوش آمدید به{" "}
                  <span className="text-indigo-700">جا استادی</span>
                </>
              ) : (
                <>
                  شروعی تازه در{" "}
                  <span className="text-indigo-700">جا استادی</span>
                </>
              )}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600 sm:text-base lg:mx-0">
              {tab === "login"
                ? "برای دسترسی به حساب و خدمات دانشجویی وارد شوید."
                : "حساب خود را بسازید و خدمات دانشگاهی را یک‌جا دنبال کنید."}
            </p>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(35,42,87,0.08)] sm:p-8">
            <div
              className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1"
              role="tablist"
              aria-label="انتخاب ورود یا ثبت‌نام"
            >
              <button
                type="button"
                role="tab"
                id="login-tab"
                aria-selected={tab === "login"}
                aria-controls="auth-form-panel"
                onClick={() => switchTab("login")}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  tab === "login"
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <LogIn className="h-4 w-4" />
                ورود
              </button>
              <button
                type="button"
                role="tab"
                id="register-tab"
                aria-selected={tab === "register"}
                aria-controls="auth-form-panel"
                onClick={() => switchTab("register")}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  tab === "register"
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <UserPlus className="h-4 w-4" />
                ثبت‌نام
              </button>
            </div>

            <div
              id="auth-form-panel"
              role="tabpanel"
              aria-labelledby={tab === "login" ? "login-tab" : "register-tab"}
            >
              {tab === "login" ? (
                <form onSubmit={onSubmitLogin} className="space-y-5">
                  <div>
                    <label
                      htmlFor="login-username"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      نام کاربری
                    </label>
                    <input
                      id="login-username"
                      type="text"
                      value={loginUsername}
                      onChange={(event) => setLoginUsername(event.target.value)}
                      autoComplete="username"
                      disabled={isLoading}
                      className={inputClass}
                      placeholder="نام کاربری خود را وارد کنید"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-password"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      رمز عبور
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showLoginPw ? "text" : "password"}
                        value={loginPassword}
                        onChange={(event) =>
                          setLoginPassword(event.target.value)
                        }
                        autoComplete="current-password"
                        disabled={isLoading}
                        className={`${inputClass} pl-12`}
                        placeholder="رمز عبور خود را وارد کنید"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPw((visible) => !visible)}
                        aria-label={
                          showLoginPw ? "پنهان‌کردن رمز عبور" : "نمایش رمز عبور"
                        }
                        aria-pressed={showLoginPw}
                        className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
                      >
                        {showLoginPw ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {formError && (
                    <p
                      className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-center text-sm font-medium text-rose-700"
                      role="alert"
                    >
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={submitClass}
                  >
                    <LogIn className="h-4 w-4" />
                    {isLoading ? "در حال ورود..." : "ورود به حساب"}
                  </button>
                </form>
              ) : (
                <form onSubmit={onSubmitRegister} className="space-y-5">
                  <div>
                    <label
                      htmlFor="register-username"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      نام کاربری
                    </label>
                    <input
                      id="register-username"
                      type="text"
                      value={regUsername}
                      onChange={(event) => setRegUsername(event.target.value)}
                      autoComplete="username"
                      disabled={isLoading}
                      className={inputClass}
                      placeholder="یک نام کاربری انتخاب کنید"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      بین ۳ تا ۳۲ کاراکتر
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="register-password"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      رمز عبور
                    </label>
                    <div className="relative">
                      <input
                        id="register-password"
                        type={showRegPw ? "text" : "password"}
                        value={regPassword}
                        onChange={(event) => setRegPassword(event.target.value)}
                        autoComplete="new-password"
                        disabled={isLoading}
                        className={`${inputClass} pl-12`}
                        placeholder="حداقل ۸ کاراکتر"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPw((visible) => !visible)}
                        aria-label={
                          showRegPw ? "پنهان‌کردن رمز عبور" : "نمایش رمز عبور"
                        }
                        aria-pressed={showRegPw}
                        className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
                      >
                        {showRegPw ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {formError && (
                    <p
                      className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-center text-sm font-medium text-rose-700"
                      role="alert"
                    >
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={submitClass}
                  >
                    <UserPlus className="h-4 w-4" />
                    {isLoading ? "در حال ساخت حساب..." : "ساخت حساب"}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-6 flex items-start gap-3 border-t border-slate-100 pt-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-xs leading-6 text-slate-500">
                اطلاعات حساب شما برای دسترسی امن به خدمات جا استادی استفاده
                می‌شود.
              </p>
            </div>
          </section>
        </section>

        <aside className="order-2 hidden min-w-0 lg:order-1 lg:block">
          <div className="relative overflow-hidden rounded-[2rem] bg-indigo-700 p-8 text-white xl:p-10">
            <div className="relative">
              <div className="mb-12 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
                <GraduationCap className="h-9 w-9" />
              </div>

              <p className="text-sm font-bold text-indigo-200">
                یک همراه برای مسیر دانشگاه
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-extrabold leading-[1.7] xl:text-4xl">
                همه‌چیز برای
                <span className="block text-amber-200">
                  روزهای بهتر در دانشگاه
                </span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-8 text-indigo-100 xl:text-base">
                برنامهٔ هفتگی، درس‌ها و اطلاعات آموزشی را در فضایی ساده و
                یکپارچه دنبال کنید.
              </p>

              <div className="mt-9 grid gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-200">
                    <CalendarDays className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">برنامه‌ریزی آسان‌تر</p>
                    <p className="mt-1 text-xs text-indigo-200">
                      برنامهٔ هفتگی خود را بچینید
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">اطلاعات در دسترس</p>
                    <p className="mt-1 text-xs text-indigo-200">
                      درس‌ها و جزئیاتشان را یک‌جا ببینید
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-white/15 pt-5">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-100 transition hover:text-white"
                >
                  آشنایی بیشتر با جا استادی
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="relative border-t border-slate-200/80 bg-white/60 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-right lg:px-8">
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
    </div>
  );
}
