import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import WeeklySchedulePage from "./pages/WeeklySchedulePage";
import DepartmentsPage from "./pages/DepartmentsPage";
import InstructorsPage from "./pages/InstructorsPage";
import InstructorDetailPage from "./pages/InstructorDetailPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import RoomsPage from "./pages/RoomsPage";
import { LearningHub } from "./pages/Learning";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminCommentsPage from "./pages/admin/AdminCommentsPage";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ClientPage from "./pages/ClientPage";
import RequireAuth from "./components/RequireAuth";

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
  { path: "/auth", element: <AuthPage /> },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminPage />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/comments",
    element: (
      <AdminProtectedRoute>
        <AdminCommentsPage />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <RequireAuth>
        <ClientPage />
      </RequireAuth>
    ),
  },
  { path: "*", element: <NotFoundPage /> },
]);