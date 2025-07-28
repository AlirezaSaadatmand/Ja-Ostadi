
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import WeeklySchedulePage from "./pages/WeeklySchedulePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/schedule",
    element: <WeeklySchedulePage />
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
}

export default App