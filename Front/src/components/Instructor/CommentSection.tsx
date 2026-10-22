import type React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  MessageSquarePlus,
  Quote,
  LogIn,
} from "lucide-react";
import { useCommentStore } from "../../store/comments/useCommentStore";
import { useAuthStore } from "../../store/auth/useAuthStore";
import AddCommentModal from "./AddCommentModal";

interface CommentSectionProps {
  instructorId: number;
  instructorName?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  instructorId,
  instructorName,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { comments, isLoading, error, fetchComments, clearComments } =
    useCommentStore();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    if (!hasHydrated) hydrate();
  }, [hasHydrated, hydrate]);

  useEffect(() => {
    if (instructorId) {
      fetchComments(instructorId);
    }
    return () => {
      clearComments();
    };
  }, [instructorId, fetchComments, clearComments]);

  const handleAddCommentClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleGoToLogin = () => {
    setShowLoginPrompt(false);
    navigate("/auth", {
      state: {
        from: location.pathname,
        message: "برای ثبت نظر ابتدا وارد شوید",
      },
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-6 sm:w-7 h-6 sm:h-7 text-amber-600 ml-2" />
            نظرات دانشجویان
          </h3>

          <button
            onClick={handleAddCommentClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            <MessageSquarePlus className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            ثبت نظر جدید
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-600 py-6 text-sm sm:text-base">
            {error}
          </p>
        ) : comments.length === 0 ? (
          <div className="text-center py-10">
            <Quote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm sm:text-base mb-4">
              هنوز نظری برای این استاد ثبت نشده است.
            </p>
            <button
              onClick={handleAddCommentClick}
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium text-sm sm:text-base"
            >
              <MessageSquarePlus className="w-4 h-4 ml-1.5" />
              اولین نظر را ثبت کن
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {comments.map((comment) => {
              const initial =
                comment.username?.charAt(0)?.toUpperCase() || "؟";

              return (
                <div
                  key={comment.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 relative"
                >
                  <Quote className="absolute top-3 left-3 w-5 h-5 text-amber-200" />

                  <div className="flex items-center gap-2 mb-2.5 pr-6">
                    <span className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0">
                      {initial}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {comment.username || "کاربر"}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-wrap pr-6">
                    {comment.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddCommentModal
        instructorId={instructorId}
        instructorName={instructorName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <LoginPromptModal
        isOpen={showLoginPrompt}
        onCancel={() => setShowLoginPrompt(false)}
        onLogin={handleGoToLogin}
      />
    </>
  );
};

const LoginPromptModal: React.FC<{
  isOpen: boolean;
  onCancel: () => void;
  onLogin: () => void;
}> = ({ isOpen, onCancel, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
      dir="rtl"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ورود لازم است
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            برای ثبت نظر ابتدا باید وارد حساب کاربری خود شوید.
          </p>
        </div>

        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            انصراف
          </button>
          <button
            onClick={onLogin}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            <LogIn className="w-4 h-4" />
            ورود به سیستم
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;