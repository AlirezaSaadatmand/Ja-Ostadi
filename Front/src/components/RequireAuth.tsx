import { useEffect, useRef, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth/useAuthStore";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const checkAuthStatus = useAuthStore((s) => s.checkAuthStatus);
  const hydrate = useAuthStore((s) => s.hydrate);

  const [checking, setChecking] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasHydrated) hydrate();
  }, [hasHydrated, hydrate]);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || hasChecked.current) return;
    hasChecked.current = true;
    setChecking(true);
    void checkAuthStatus().finally(() => setChecking(false));
  }, [hasHydrated, isAuthenticated, checkAuthStatus]);

  if (!hasHydrated || checking) return <FullScreenLoader />;

  if (!isAuthenticated) {
    return (
      <Navigate to="/auth" replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
};

const FullScreenLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#FBF8F3]">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#AB8A58] border-t-transparent" />
  </div>
);

export default RequireAuth;