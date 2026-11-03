import { GitBranch, ArrowLeft } from "lucide-react";
import PageShell from "../components/common/PageShell";

export const LearningHub = () => {
  return (
    <PageShell
      title="محتوای آموزشی"
      subtitle="منابع یادگیری که طی سال‌ها تهیه شده"
      maxWidth="max-w-3xl"
    >
      <a
        href="https://parsabordbar.github.io/get-git/"
        target="_blank"
        rel="noreferrer"
        className="group flex animate-fade-up items-center gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl"
      >
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand-dark transition-colors group-hover:bg-brand group-hover:text-white">
          <GitBranch className="h-7 w-7" />
        </span>
        <span className="flex-1">
          <span className="block text-lg font-semibold text-gray-900">
            آموزش گیت و گیت‌هاب
          </span>
          <span className="block text-sm text-gray-500">
            فعلا فقط می‌تونی گیت و گیت‌هاب یاد بگیری
          </span>
        </span>
        <ArrowLeft className="h-5 w-5 text-gray-400 transition-transform group-hover:-translate-x-1" />
      </a>
    </PageShell>
  );
};
