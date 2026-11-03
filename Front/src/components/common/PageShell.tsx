import type { ReactNode } from "react";
import Header from "../Header";

interface PageShellProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: string;
}

/**
 * Shared page layout: brand gradient background, fixed header offset,
 * animated hero title and a centered content container.
 */
const PageShell = ({
  title,
  subtitle,
  children,
  maxWidth = "max-w-7xl",
}: PageShellProps) => (
  <div
    className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-brand-light via-white to-[#f3ece0]"
    dir="rtl"
  >
    <div
      aria-hidden
      className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand/15 blur-3xl"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl"
    />
    <Header />

    <main className={`relative mx-auto ${maxWidth} px-4 pb-16 pt-24 sm:px-6`}>
      {title && (
        <div className="mb-8 text-center animate-fade-up">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base text-gray-600 sm:text-lg">
              {subtitle}
            </p>
          )}
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-l from-brand to-brand-dark" />
        </div>
      )}
      {children}
    </main>
  </div>
);

export default PageShell;
