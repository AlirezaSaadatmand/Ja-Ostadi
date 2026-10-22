import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Clock3,
  CheckCircle2,
  XCircle,
  LogOut,
  Inbox,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import Header from "../components/Header";
import { useAuthStore } from "../store/auth/useAuthStore";
import { useCommentStore } from "../store/comments/useCommentStore";
import type { CommentStatus, MyComment } from "../types";

const STATUS_META: Record<
  CommentStatus,
  { label: string; badge: string; dot: string }
> = {
  pending: {
    label: "در انتظار تایید",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  approved: {
    label: "تایید شده",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "رد شده",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export default function ClientPage() {
  const navigate = useNavigate();

  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);

  const {
    myComments,
    isMyCommentsLoading,
    error,
    fetchMyComments,
    clearMyComments,
  } = useCommentStore();

  useEffect(() => {
    void fetchMyComments();
    return () => {
      clearMyComments();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const counts = { pending: 0, approved: 0, rejected: 0 };
    for (const c of myComments) {
      const s = c.status as CommentStatus;
      if (s in counts) counts[s]++;
    }
    return { ...counts, total: myComments.length };
  }, [myComments]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRefresh = () => {
    void fetchMyComments();
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] font-sans" dir="rtl">
      <Header />

      <main className="relative mx-auto max-w-3xl px-4 sm:px-6 pt-28 sm:pt-36 pb-16">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              <span className="inline-flex items-center gap-1">
                این تویی {" "}  <ArrowLeft className="w-4 h-4" />
              </span>
              <span className="text-[#AB8A58]">{username ?? "کاربر"}</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              اینجا می‌تونی نظراتی که ثبت کردی رو ببینی.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatMini
            label="در انتظار"
            value={stats.pending}
            tone="amber"
            icon={Clock3}
          />
          <StatMini
            label="تایید شده"
            value={stats.approved}
            tone="emerald"
            icon={CheckCircle2}
          />
          <StatMini
            label="رد شده"
            value={stats.rejected}
            tone="rose"
            icon={XCircle}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#AB8A58]" />
            نظرات من
            <span className="text-sm font-normal text-gray-500">
              ({stats.total.toLocaleString("fa-IR")})
            </span>
          </h2>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isMyCommentsLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="بروزرسانی"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isMyCommentsLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {isMyCommentsLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : myComments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {myComments.map((c) => (
              <CommentCard key={c.id} comment={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const StatMini: React.FC<{
  label: string;
  value: number;
  tone: "amber" | "emerald" | "rose";
  icon: React.ElementType;
}> = ({ label, value, tone, icon: Icon }) => {
  const tones = {
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
  }[tone];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 flex items-center gap-3">
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tones}`}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs text-gray-500 truncate">{label}</p>
        <p className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
          {value.toLocaleString("fa-IR")}
        </p>
      </div>
    </div>
  );
};

const CommentCard: React.FC<{ comment: MyComment }> = ({ comment }) => {
  const meta =
    STATUS_META[comment.status as CommentStatus] ?? STATUS_META.pending;

  return (
    <article className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${meta.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
        <span className="text-xs text-gray-500">
          برای استاد{" "}
          <span className="font-medium text-gray-900">
            {comment.instructor_name}
          </span>
        </span>
        <span className="text-xs text-gray-400">•</span>
        <span className="text-xs text-gray-500">
          {formatDate(comment.created_at)}
        </span>
      </div>

      <p className="text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
        {comment.content}
      </p>
    </article>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 animate-pulse">
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <div className="h-5 w-24 bg-gray-200 rounded-md" />
      <div className="h-4 w-28 bg-gray-100 rounded-md" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-4/5" />
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
      <Inbox className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-base font-semibold text-gray-800 mb-1">
      هنوز نظری ثبت نکردی
    </h3>
    <p className="text-sm text-gray-500">
      وقتی برای استادی نظر بذاری، اینجا نمایش داده می‌شه.
    </p>
  </div>
);