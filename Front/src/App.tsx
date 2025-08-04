import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Home from "./pages/Home"
import NotFoundPage from "./pages/NotFoundPage"
import WeeklySchedulePage from "./pages/WeeklySchedulePage"
import DepartmentsPage from "./pages/DepartmentsPage"
import InstructorsPage from "./pages/InstructorsPage" // New import

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
    path: "/instructors", // New route
    element: <InstructorsPage />,
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
