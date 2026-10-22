import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="relative min-h-screen bg-[#FBF8F3] font-sans"
    >
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 pb-16">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          پنل مدیریت
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          به پنل مدیریت خوش آمدی.
        </p>

        <button
          type="button"
          onClick={() => navigate("/admin/comments")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#AB8A58] px-5 py-2.5 text-white font-semibold shadow-[0_4px_14px_-4px_rgba(171,138,88,0.5)] hover:bg-[#96764A] transition"
        >
          <MessageSquare className="h-4 w-4" />
          مدیریت نظرات
        </button>
      </main>
    </div>
  );
}