import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Home from "./pages/Home"
import NotFoundPage from "./pages/NotFoundPage"
import WeeklySchedulePage from "./pages/WeeklySchedulePage"
import DepartmentsPage from "./pages/DepartmentsPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/schedule",
    element: <WeeklySchedulePage />,
  },
  {
    path: "/departments",
    element: <DepartmentsPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
