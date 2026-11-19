import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/auth/useAuthStore";
import Header from "../components/Header";

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

  const {
    login,
    register,
    isLoading,
    isAuthenticated,
    role,
    checkAuthStatus,
  } = useAuthStore();

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

    const dest =
      role === "admin" ? "/admin" : from && from !== "/" && from !== "/auth" ? from : "/profile";
    navigate(dest, { replace: true });
  }, [isAuthenticated, role, isLoading, from, navigate, checkAuthStatus]);

  const switchTab = (next: Tab) => {
    if (next === tab) return;
    setFormError(null);
    setTab(next);
  };

  const onSubmitLogin = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!loginUsername.trim() || !loginPassword) {
      setFormError("نام کاربری و رمز عبور الزامی است");
      return;
    }

    try {
      await login(loginUsername.trim(), loginPassword);
      toast.success("خوش برگشتی!");
    } catch {
      const errorMsg = useAuthStore.getState().error ?? "ورود ناموفق بود";
      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const onSubmitRegister = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const u = regUsername.trim();
    if (u.length < 3 || u.length > 32) {
      setFormError("نام کاربری باید بین ۳ تا ۳۲ کاراکتر باشد");
      return;
    }
    if (regPassword.length < 8) {
      setFormError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

    try {
      const result = await register(u, regPassword);

      if (result === "created_needs_login") {
        setLoginUsername(u);
        setLoginPassword("");
        setRegUsername("");
        setRegPassword("");
        setTab("login");
        toast.success("حساب ساخته شد — لطفاً وارد شو");
        return;
      }

      toast.success("حساب ساخته شد!");
    } catch {
      const errorMsg = useAuthStore.getState().error ?? "ثبت‌نام ناموفق بود";
      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-[#FBF8F3]/60 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AB8A58]/40 focus:border-[#AB8A58] transition disabled:opacity-60";

  const submitClass =
    "w-full rounded-xl bg-[#AB8A58] px-4 py-2.5 text-white font-semibold shadow-[0_4px_14px_-4px_rgba(171,138,88,0.5)] hover:bg-[#96764A] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  return (
    <div
      dir="rtl"
      className="relative min-h-screen bg-[#FBF8F3] font-sans overflow-x-hidden"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#AB8A58]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#AB8A58]/10 blur-3xl" />
      </div>

      <Header />

      <main className="relative z-10 mx-auto max-w-md px-4 sm:px-6 pt-32 sm:pt-40 pb-16 sm:pb-24">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#AB8A58]/30 bg-white/70 backdrop-blur px-4 py-1.5 text-xs sm:text-sm font-medium text-[#8B6E42] mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#AB8A58]" />
            دانشگاه فسا
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-gray-900 mb-3">
            {tab === "login" ? (
              <>
                خوش <span className="text-[#AB8A58]">برگشتی</span>
              </>
            ) : (
              <>
                ساخت <span className="text-[#AB8A58]">حساب</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {tab === "login"
              ? "برای ادامه وارد حساب خودت شو."
              : "ثانیه‌ای بیشتر طول نمی‌کشه."}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 sm:p-8 ring-1 ring-gray-200/70 shadow-[0_12px_40px_-12px_rgba(171,138,88,0.15)]">
          <div className="mb-6 flex rounded-xl bg-[#FBF8F3] p-1 ring-1 ring-gray-200/70">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                tab === "login"
                  ? "bg-white text-[#8B6E42] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ورود
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                tab === "register"
                  ? "bg-white text-[#8B6E42] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ثبت‌نام
            </button>
          </div>

          {tab === "login" && (
            <form onSubmit={onSubmitLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  نام کاربری
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  autoComplete="username"
                  disabled={isLoading}
                  className={inputClass}
                  placeholder="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type={showLoginPw ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={isLoading}
                    className={`${inputClass} pl-11`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPw((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
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
                <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-lg text-center" role="alert">
                  {formError}
                </p>
              )}

              <button type="submit" disabled={isLoading} className={submitClass}>
                <LogIn className="h-4 w-4" />
                {isLoading ? "در حال ورود…" : "ورود"}
              </button>
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={onSubmitRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  نام کاربری
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  autoComplete="username"
                  disabled={isLoading}
                  className={inputClass}
                  placeholder="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type={showRegPw ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={isLoading}
                    className={`${inputClass} pl-11`}
                    placeholder="حداقل ۸ کاراکتر"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPw((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
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
                <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-lg text-center" role="alert">
                  {formError}
                </p>
              )}

              <button type="submit" disabled={isLoading} className={submitClass}>
                <UserPlus className="h-4 w-4" />
                {isLoading ? "در حال ساخت…" : "ساخت حساب"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          با ادامه، شرایط استفاده را می‌پذیری.
        </p>
      </main>
    </div>
  );
}