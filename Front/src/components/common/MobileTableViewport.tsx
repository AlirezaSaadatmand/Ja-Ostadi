import { useId, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowLeftRight, Shrink } from "lucide-react";
import "./MobileTableViewport.css";

interface Props {
  children: ReactNode;
  label: string;
  minWidth?: number;
  className?: string;
}

const MobileTableViewport = ({
  children,
  label,
  minWidth = 1050,
  className = "",
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const viewportId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);

  const toggleMode = () => {
    viewportRef.current?.scrollTo({ left: 0 });
    setIsExpanded((expanded) => !expanded);
  };

  return (
    <div
      className={`mobile-table-viewport ${className}`}
      data-mobile-table-mode={isExpanded ? "expanded" : "fit"}
      style={{ "--mobile-table-min-width": `${minWidth}px` } as CSSProperties}
      dir="rtl"
    >
      <div className="mobile-table-controls" data-pdf-exclude>
        <button
          type="button"
          className="mobile-table-toggle"
          onClick={toggleMode}
          aria-pressed={isExpanded}
          aria-controls={viewportId}
          aria-label={`${isExpanded ? "نمایش متناسب با صفحه" : "نمایش کامل جدول"}؛ ${label}`}
        >
          {isExpanded ? (
            <Shrink aria-hidden="true" />
          ) : (
            <ArrowLeftRight aria-hidden="true" />
          )}
          {isExpanded ? "نمایش متناسب با صفحه" : "نمایش کامل جدول"}
        </button>
        {isExpanded && (
          <p className="mobile-table-hint">جدول را به چپ و راست بکشید.</p>
        )}
      </div>
      <div
        id={viewportId}
        ref={viewportRef}
        className="mobile-table-scroll"
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileTableViewport;
