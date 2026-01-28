import { createBrowserRouter } from "react-router-dom"

import Home from "./pages/Home"
import NotFoundPage from "./pages/NotFoundPage"
import WeeklySchedulePage from "./pages/WeeklySchedulePage"
import DepartmentsPage from "./pages/DepartmentsPage"
import InstructorsPage from "./pages/InstructorsPage"
import InstructorDetailPage from "./pages/InstructorDetailPage"
import CoursesPage from "./pages/CoursesPage"
import CourseDetailPage from "./pages/CourseDetailPage"
import RoomsPage from "./pages/RoomsPage"
import { LearningHub } from "./pages/Learning"
import LoginPage from "./pages/LoginPage"
import DirectorsPage from "./pages/Directors/DirectorsPage"
import ProtectedRoute from "./components/ProtectedRoute"
import CreateTempCoursePage from "./pages/Directors/CreateTempCoursePage"

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/schedule", element: <WeeklySchedulePage /> },
  { path: "/departments", element: <DepartmentsPage /> },
  { path: "/instructors", element: <InstructorsPage /> },
  { path: "/instructors/:instructorId", element: <InstructorDetailPage /> },
  { path: "/courses", element: <CoursesPage /> },
  { path: "/courses/:courseId", element: <CourseDetailPage /> },
  { path: "/classes", element: <RoomsPage /> },
  { path: "/learning-hub", element: <LearningHub /> },

  {
    path: "/directors",
    element: (
      <ProtectedRoute role="director">
        <DirectorsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/directors/temp-courses/new",
    element: (
      <ProtectedRoute role="director">
        <CreateTempCoursePage />
      </ProtectedRoute>
    ),
  },

  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <NotFoundPage /> },
])
