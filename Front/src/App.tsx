import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"

import Home from "./pages/Home"
import NotFoundPage from "./pages/NotFoundPage"
import WeeklySchedulePage from "./pages/WeeklySchedulePage"
import DepartmentsPage from "./pages/DepartmentsPage"
import InstructorsPage from "./pages/InstructorsPage"
import InstructorDetailPage from "./pages/InstructorDetailPage"
import CoursesPage from "./pages/CoursesPage"
import CourseDetailPage from "./pages/CourseDetailPage"
import AuthPage from "./pages/AuthPage"
import FoodPage from "./pages/FoodPage"
import RoomsPage from "./pages/RoomsPage"
import { LearningHub } from "./pages/Learning"

const AppRoutes = () => {
  const [initialized, setInitialized] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("jwt")
    setIsAuthenticated(!!token)
    setInitialized(true)
  }, [])

  if (!initialized) {
    return <div className="p-4 text-center">Loading...</div>
  }

  const router = createBrowserRouter([
    {
      path: "/login",
      element: isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />,
    },
    { path: "/", element: <Home /> },

    {
      path: "/schedule",
      element: <WeeklySchedulePage />
    },
    {
      path: "/departments",
      element: <DepartmentsPage />
    },
    {
      path: "/instructors",
      element: <InstructorsPage />
    },
    {
      path: "/instructors/:instructorId",
      element: <InstructorDetailPage />
    },
    {
      path: "/courses",
      element: <CoursesPage />
    },
    {
      path: "/courses/:courseId",
      element: <CourseDetailPage />
    },
    {
      path: "/food",
      element: isAuthenticated ? <FoodPage /> : <Navigate to="/login" replace />
    },
    {
      path: "/classes",
      element: <RoomsPage /> 
    },
    {
      path: "/learning-hub",
      element: <LearningHub />
    },
    { path: "*", element: <NotFoundPage /> },
  ])

  return <RouterProvider router={router} />
}

export default AppRoutes
