import type React from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import PageShell from "../components/common/PageShell";

const notFoundMessages = [
  "اخخخ رفتی تو دیوار که :)",
  "بَد شد که :/",
  "یا خودش میاد یا خبرش ... فعلا که خبری ازش نی",
  "به کاه‌دون زدی مهندس",
  "فععک نکنم این صفحه وجود داشته باشه",
];

const NotFoundPage: React.FC = () => {
  const message = useMemo(
    () => notFoundMessages[Math.floor(Math.random() * notFoundMessages.length)],
    [],
  );

  return (
    <PageShell maxWidth="max-w-2xl">
      <div className="flex flex-col items-center py-10 text-center">
        <h1 className="animate-float bg-gradient-to-l from-brand to-brand-dark bg-clip-text text-8xl font-extrabold text-transparent sm:text-[10rem]">
          ۴۰۴
        </h1>
        <h2 className="mt-4 animate-fade-up text-2xl font-bold text-gray-900 sm:text-4xl">
          صفحه مورد نظر یافت نشد
        </h2>
        <p
          className="mt-4 max-w-md animate-fade-up text-gray-600"
          style={{ animationDelay: "100ms" }}
        >
          {message}
        </p>
        <Link
          to="/"
          style={{ animationDelay: "200ms" }}
          className="mt-8 inline-flex animate-fade-up items-center gap-2 rounded-xl bg-brand px-8 py-3 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg"
        >
          <Home className="h-5 w-5" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </PageShell>
  );
};

export default NotFoundPage;
