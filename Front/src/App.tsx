import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth/useAuthStore";
import { router } from "./router";

const AppRoutes = () => {
  const hydrate = useAuthStore((s) => s.hydrate);
  const checkAuthStatus = useAuthStore((s) => s.checkAuthStatus);

  useEffect(() => {
    hydrate();
    if (useAuthStore.getState().token) {
      checkAuthStatus();
    }
  }, [hydrate, checkAuthStatus]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;