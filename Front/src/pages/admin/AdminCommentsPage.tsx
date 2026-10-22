import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  Loader2,
  LogOut,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Search,
  Inbox,
  Clock3,
  ShieldCheck,
  Ban,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { useAdminCommentStore } from "../../store/admin/useAdminCommentStore";
import type { AdminComment, CommentStatus } from "../../types";

const STATUS_META: Record<
  CommentStatus,
  { label: string; badge: string; dot: string }
> = {
  pending: {
    label: "در انتظار",
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

const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ElementType;
  tone: "amber" | "emerald" | "rose" | "gray";
  active?: boolean;
  onClick: () => void;
}> = ({ label, value, icon: Icon, tone, active, onClick }) => {
  const tones = {
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-400",
      hover: "hover:border-amber-300",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-400",
      hover: "hover:border-emerald-300",
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-400",
      hover: "hover:border-rose-300",
    },
    gray: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      ring: "ring-gray-400",
      hover: "hover:border-gray-300",
    },
  }[tone];

  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-2xl border p-4 sm:p-5 text-right transition-all flex items-center gap-4 ${
        active
          ? `border-transparent ring-2 ${tones.ring}`
          : `border-gray-200 ${tones.hover} hover:shadow-sm`
      }`}
    >
      <div
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${tones.bg}`}
      >
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${tones.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
          {value.toLocaleString("fa-IR")}
        </p>
      </div>
    </button>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 animate-pulse">
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <div className="h-5 w-20 bg-gray-200 rounded-md" />
      <div className="h-4 w-24 bg-gray-100 rounded-md" />
      <div className="h-4 w-32 bg-gray-100 rounded-md" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-4/5" />
    </div>
  </div>
);

const Toast: React.FC<{
  message: string;
  type: "success" | "error";
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles =
    type === "success"
      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
      : "bg-rose-50 border-rose-200 text-rose-800";

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${styles} animate-in fade-in slide-in-from-top-2`}
      dir="rtl"
    >
      {type === "success" ? (
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/5 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const DeleteConfirmModal: React.FC<{
  comment: AdminComment | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ comment, isDeleting, onCancel, onConfirm }) => {
  if (!comment) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
      dir="rtl"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                حذف این نظر؟
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                این عملیات قابل بازگشت نیست. آیا مطمئن هستید؟
              </p>
            </div>
          </div>

          {comment.username && (
            <p className="mt-4 text-xs text-gray-500">
              نویسنده:{" "}
              <span className="font-medium text-gray-700">
                {comment.username}
              </span>
            </p>
          )}

          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        </div>

        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال حذف...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                بله، حذف کن
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const FILTERS: { label: string; value: CommentStatus | "" }[] = [
  { label: "در انتظار تایید", value: "pending" },
  { label: "تایید شده", value: "approved" },
  { label: "رد شده", value: "rejected" },
  { label: "همه", value: "" },
];

const AdminCommentsPage: React.FC = () => {
  const {
    comments,
    total,
    page,
    limit,
    statusFilter,
    isLoading,
    error,
    counts,
    fetchComments,
    fetchCounts,
    updateCommentStatus,
    deleteComment,
    clearAdminComments,
  } = useAdminCommentStore();

  const logout = useAuthStore((s) => s.logout);

  const [actionId, setActionId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminComment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchComments(statusFilter, 1, limit);
    fetchCounts();
    return () => {
      clearAdminComments();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleComments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return comments;
    return comments.filter(
      (c) =>
        String(c.instructor_id).includes(term) ||
        (c.username ?? "").toLowerCase().includes(term),
    );
  }, [comments, searchTerm]);

  const handleFilterChange = (value: CommentStatus | "") => {
    setSearchTerm("");
    fetchComments(value, 1, limit);
  };

  const handleRefresh = () => {
    fetchComments(statusFilter, page, limit);
    fetchCounts();
  };

  const handleApprove = async (id: number) => {
    setActionId(id);
    const ok = await updateCommentStatus(id, "approved");
    setActionId(null);
    setToast({
      message: ok ? "نظر تایید شد" : "خطا در تایید نظر",
      type: ok ? "success" : "error",
    });
  };

  const handleReject = async (id: number) => {
    setActionId(id);
    const ok = await updateCommentStatus(id, "rejected");
    setActionId(null);
    setToast({
      message: ok ? "نظر رد شد" : "خطا در رد کردن نظر",
      type: ok ? "success" : "error",
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const ok = await deleteComment(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
    setToast({
      message: ok ? "نظر حذف شد" : "خطا در حذف نظر",
      type: ok ? "success" : "error",
    });
  };

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("fa-IR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const grandTotal = counts.pending + counts.approved + counts.rejected;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                پنل مدیریت نظرات
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                بررسی، تایید و مدیریت نظرات دانشجویان
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="بروزرسانی"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="در انتظار تایید"
            value={counts.pending}
            icon={Clock3}
            tone="amber"
            active={statusFilter === "pending"}
            onClick={() => handleFilterChange("pending")}
          />
          <StatCard
            label="تایید شده"
            value={counts.approved}
            icon={CheckCircle2}
            tone="emerald"
            active={statusFilter === "approved"}
            onClick={() => handleFilterChange("approved")}
          />
          <StatCard
            label="رد شده"
            value={counts.rejected}
            icon={Ban}
            tone="rose"
            active={statusFilter === "rejected"}
            onClick={() => handleFilterChange("rejected")}
          />
          <StatCard
            label="مجموع نظرات"
            value={grandTotal}
            icon={MessageSquare}
            tone="gray"
            active={statusFilter === ""}
            onClick={() => handleFilterChange("")}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو با نام کاربری یا شناسه استاد..."
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  statusFilter === f.value
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : visibleComments.length === 0 ? (
          <EmptyState
            hasSearch={!!searchTerm.trim()}
            onReset={() => setSearchTerm("")}
          />
        ) : (
          <div className="space-y-3">
            {visibleComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                isActing={actionId === comment.id}
                onApprove={() => handleApprove(comment.id)}
                onReject={() => handleReject(comment.id)}
                onDelete={() => setDeleteTarget(comment)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && !isLoading && (
          <Pagination
            page={page}
            totalPages={totalPages}
            isLoading={isLoading}
            onPrev={() => fetchComments(statusFilter, page - 1, limit)}
            onNext={() => fetchComments(statusFilter, page + 1, limit)}
          />
        )}
      </main>

      <DeleteConfirmModal
        comment={deleteTarget}
        isDeleting={isDeleting}
        onCancel={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

const CommentCard: React.FC<{
  comment: AdminComment;
  isActing: boolean;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  formatDate: (s: string) => string;
}> = ({ comment, isActing, onApprove, onReject, onDelete, formatDate }) => {
  const meta = STATUS_META[comment.status];
  const initial = comment.username?.charAt(0)?.toUpperCase() ?? "؟";

  return (
    <article className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${meta.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-700">
                {initial}
              </span>
              <span>
                نویسنده:{" "}
                <span className="font-medium text-gray-700">
                  {comment.username || "نامشخص"}
                </span>
              </span>
            </span>

            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              شناسه استاد:{" "}
              <span className="font-medium text-gray-700">
                {comment.instructor_id}
              </span>
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              نام استاد:{" "}
              <span className="font-medium text-gray-700">
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

          <p className="text-xs text-gray-400 mt-3 font-mono" dir="ltr">
            {comment.ip_address}
          </p>
        </div>

        <div className="flex lg:flex-col gap-2 flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-r lg:pr-4 border-gray-100">
          {comment.status !== "approved" && (
            <button
              onClick={onApprove}
              disabled={isActing}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200 transition-colors disabled:opacity-50 min-w-[90px]"
            >
              {isActing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  تایید
                </>
              )}
            </button>
          )}
          {comment.status !== "rejected" && (
            <button
              onClick={onReject}
              disabled={isActing}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-sm font-medium border border-amber-200 transition-colors disabled:opacity-50 min-w-[90px]"
            >
              <XCircle className="w-4 h-4" />
              رد
            </button>
          )}
          <button
            onClick={onDelete}
            disabled={isActing}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-600 rounded-lg text-sm font-medium border border-gray-200 hover:border-rose-200 transition-colors disabled:opacity-50 min-w-[90px]"
          >
            <Trash2 className="w-4 h-4" />
            حذف
          </button>
        </div>
      </div>
    </article>
  );
};

const EmptyState: React.FC<{ hasSearch: boolean; onReset: () => void }> = ({
  hasSearch,
  onReset,
}) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
      <Inbox className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-base font-semibold text-gray-800 mb-1">
      {hasSearch ? "نتیجه‌ای یافت نشد" : "هیچ نظری اینجا نیست"}
    </h3>
    <p className="text-sm text-gray-500">
      {hasSearch
        ? "عبارت جستجو را تغییر دهید یا فیلتر را پاک کنید."
        : "وقتی نظری مطابق این فیلتر ثبت شود، اینجا نمایش داده می‌شود."}
    </p>
    {hasSearch && (
      <button
        onClick={onReset}
        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
        پاک کردن جستجو
      </button>
    )}
  </div>
);

const Pagination: React.FC<{
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
}> = ({ page, totalPages, isLoading, onPrev, onNext }) => (
  <div className="flex items-center justify-center gap-2 pt-2">
    <button
      onClick={onPrev}
      disabled={page <= 1 || isLoading}
      className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
      قبلی
    </button>
    <span className="text-sm text-gray-600 px-3 tabular-nums">
      صفحه {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
    </span>
    <button
      onClick={onNext}
      disabled={page >= totalPages || isLoading}
      className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      بعدی
      <ChevronLeft className="w-4 h-4" />
    </button>
  </div>
);

export default AdminCommentsPage;