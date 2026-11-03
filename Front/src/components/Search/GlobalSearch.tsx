import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Search, X } from "lucide-react";
import api from "../../utils/axios";
import config from "../../config/config";
import type { CourseResponse, InstructorListItem } from "../../types";

interface SearchEntry {
  key: string;
  kind: "course" | "instructor";
  title: string;
  subtitle: string;
  href: string;
  haystack: string;
}

const MAX_RESULTS = 12;

const normalizeFa = (text: string) =>
  text
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ً-ٟـ]/g, "")
    .replace(/‌/g, " ")
    .toLowerCase()
    .trim();

interface Props {
  open: boolean;
  onClose: () => void;
}

const GlobalSearch = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [active, setActive] = useState(0);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [coursesRes, instructorsRes] = await Promise.all([
        api.get(`${config.apiUrl}/schedule/data`),
        api.get(`${config.apiUrl}/instructors/data`),
      ]);

      const courses: CourseResponse[] = Array.isArray(coursesRes.data.data)
        ? coursesRes.data.data
        : [];
      const instructors: InstructorListItem[] = Array.isArray(
        instructorsRes.data.data,
      )
        ? instructorsRes.data.data
        : [];

      const seenCourses = new Set<number>();
      const seenInstructors = new Set<number>();
      const result: SearchEntry[] = [];

      for (const c of courses) {
        if (seenCourses.has(c.course.id)) continue;
        seenCourses.add(c.course.id);
        const subtitle = [c.instructor?.name, c.department?.name]
          .filter(Boolean)
          .join(" · ");
        result.push({
          key: `course-${c.course.id}`,
          kind: "course",
          title: c.course.name,
          subtitle,
          href: `/courses/${c.course.id}`,
          haystack: normalizeFa(`${c.course.name} ${c.course.number} ${subtitle}`),
        });
      }

      for (const i of instructors) {
        const id = i.relations.instructor_id;
        if (seenInstructors.has(id)) continue;
        seenInstructors.add(id);
        result.push({
          key: `instructor-${id}`,
          kind: "instructor",
          title: i.instructor.name,
          subtitle: i.instructor.field,
          href: `/instructors/${id}`,
          haystack: normalizeFa(`${i.instructor.name} ${i.instructor.field}`),
        });
      }

      setEntries(result);
      setStatus("ready");
    } catch (error) {
      console.error("Error loading search data:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    inputRef.current?.focus();
    if (status === "idle" || status === "error") load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const terms = normalizeFa(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return entries
      .filter((e) => terms.every((t) => e.haystack.includes(t)))
      .slice(0, MAX_RESULTS);
  }, [entries, query]);

  const go = (entry: SearchEntry) => {
    onClose();
    navigate(entry.href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 backdrop-blur-sm px-4 pt-[12vh]"
      dir="rtl"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-label="جستجو"
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <Search className="h-5 w-5 text-[#AB8A58]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="جستجوی درس یا استاد..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            aria-label="بستن"
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {status === "loading" && (
            <p className="p-6 text-center text-sm text-gray-500">
              در حال بارگذاری...
            </p>
          )}
          {status === "error" && (
            <div className="p-6 text-center text-sm text-gray-600">
              <p>دریافت اطلاعات انجام نشد.</p>
              <button
                onClick={load}
                className="mt-3 rounded-lg bg-[#AB8A58] px-4 py-1.5 font-semibold text-white"
              >
                تلاش مجدد
              </button>
            </div>
          )}
          {status === "ready" && query && results.length === 0 && (
            <p className="p-6 text-center text-sm text-gray-500">
              نتیجه‌ای پیدا نشد.
            </p>
          )}
          {status === "ready" && !query && (
            <p className="p-6 text-center text-sm text-gray-400">
              نام درس، شماره درس یا نام استاد را بنویسید.
            </p>
          )}
          <ul>
            {results.map((entry, index) => {
              const Icon = entry.kind === "course" ? BookOpen : GraduationCap;
              return (
                <li key={entry.key}>
                  <button
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(entry)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-right transition-colors ${
                      index === active ? "bg-[#AB8A58]/10" : ""
                    }`}
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#AB8A58]/15 text-[#8a6d3f]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-gray-900">
                        {entry.title}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {entry.subtitle}
                      </span>
                    </span>
                    <span className="text-xs text-gray-400">
                      {entry.kind === "course" ? "درس" : "استاد"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-400 sm:block">
          ↑↓ برای حرکت · Enter برای باز کردن · Esc برای بستن
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
