import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Home from "./pages/Home"
import NotFoundPage from "./pages/NotFoundPage"
import WeeklySchedulePage from "./pages/WeeklySchedulePage"
import DepartmentsPage from "./pages/DepartmentsPage"
import InstructorsPage from "./pages/InstructorsPage"
import InstructorDetailPage from "./pages/InstructorDetailPage"
import CoursesPage from "./pages/CoursesPage"
import CourseDetailPage from "./pages/CourseDetailPage"

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
    path: "/instructors",
    element: <InstructorsPage />,
  },
  {
    path: "/instructors/:instructorId",
    element: <InstructorDetailPage />,
  },
  {
    path: "/courses",
    element: <CoursesPage />,
  },
  {
    path: "/courses/:courseId",
    element: <CourseDetailPage />,
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
