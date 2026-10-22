import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Users,
  ClipboardList,
} from "lucide-react";
import { useCommentStore } from "../../store/comments/useCommentStore";
import { sanitizeComment, validateCommentContent } from "../../utils/validation";

interface AddCommentModalProps {
  instructorId: number;
  instructorName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const GUIDELINES = [
  {
    icon: BookOpen,
    title: "روش تدریس",
    text: "مثال: «مطالب را با مثال‌های واقعی توضیح می‌دهند و سر کلاس خیلی منظم هستند.»",
  },
  {
    icon: Users,
    title: "برخورد و رفتار",
    text: "مثال: «در ساعات اداری پاسخگو هستند و با دانشجوها با احترام رفتار می‌کنند.»",
  },
  {
    icon: ClipboardList,
    title: "ارزشیابی و تکالیف",
    text: "مثال: «تکالیف سنگین ولی منصفانه است و بارم‌بندی مشخصی دارند.»",
  },
];

const AddCommentModal: React.FC<AddCommentModalProps> = ({
  instructorId,
  instructorName,
  isOpen,
  onClose,
}) => {
  const [content, setContent] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    isSubmitting,
    error,
    successMessage,
    submitComment,
    resetSubmitStatus,
  } = useCommentStore();

  useEffect(() => {
    if (isOpen) {
      setContent("");
      setValidationError(null);
      resetSubmitStatus();
    }
  }, [isOpen, resetSubmitStatus]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !successMessage) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [isOpen, successMessage, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitized = sanitizeComment(content);
    const err = validateCommentContent(sanitized);
    setValidationError(err);
    if (err) return;

    await submitComment(instructorId, sanitized);
  };

  const charCount = [...content].length;
  const canSubmit =
    !isSubmitting && charCount >= 2 && charCount <= 2000;

  const displayName = instructorName?.trim()
    ? `استاد ${instructorName}`
    : "این استاد";

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
            {successMessage ? (
              <>
                <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-green-600 ml-2" />
                نظر شما ثبت شد
              </>
            ) : (
              <>
                <Lightbulb className="w-5 sm:w-6 h-5 sm:h-6 text-amber-600 ml-2" />
                ثبت نظر برای{" "}
                <span className="text-amber-700 mr-1">{displayName}</span>
              </>
            )}
          </h3>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {successMessage ? (
            <div className="text-center py-8 sm:py-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                با موفقیت ثبت شد
              </h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
                {successMessage}
              </p>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                بستن
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm sm:text-base text-amber-900 font-semibold mb-3 flex items-center">
                  <Lightbulb className="w-4 h-4 ml-1.5" />
                  برای اینکه نظرت مفید باشه، به این موارد اشاره کن:
                </p>
                <div className="space-y-3">
                  {GUIDELINES.map((g) => {
                    const Icon = g.icon;
                    return (
                      <div key={g.title} className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-900">
                            {g.title}
                          </p>
                          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                            {g.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs sm:text-sm text-amber-800 mt-3 pt-3 border-t border-amber-200">
                  از نوشتن نظرات کوتاه مثل «خوب بود» یا «بد بود» خودداری کن — این
                  جملات به بقیه دانشجوها کمک نمی‌کنه.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="تجربه خودت از کلاس و رفتار این استاد را بنویس..."
                  rows={6}
                  maxLength={2000}
                  disabled={isSubmitting}
                  autoFocus
                  className="w-full border border-gray-300 rounded-xl p-3 sm:p-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none disabled:bg-gray-50"
                  dir="rtl"
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3">
                  <span className="text-xs sm:text-sm text-gray-500">
                    {charCount} / 2000
                  </span>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 sm:px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 ml-2 animate-spin" />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                          ارسال نظر
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {(validationError || error) && (
                  <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{validationError || error}</span>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default AddCommentModal;