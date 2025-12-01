import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import ForgotPassword from "./pages/auth/forgatePassowrd";
import ResetPassword from "./pages/auth/sesetPassword";
import Dashbord from "./pages/event/dashboard";
import EventPage from "./pages/event/eventPage";
import ProfilePage from "./pages/users/profile";
import UserDashboard from "./pages/users/dashbord";
import AdminDashboard from "./pages/admin/adminDashbord";
import UserEventRequestPage from "./pages/users/eventRequest";
import AdminCreateEvent from "./pages/admin/adminEventCreate";
import AdminEventEdit from "./pages/admin/adminEventEdit";
import AdminEventInvite from "./pages/admin/adminEventInvite";
import ProtectedRoute from "./components/protectedRoute";




const router = createBrowserRouter([
  // Public routes
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot", element: <ForgotPassword /> },


  // Event routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashbord/>
      </ProtectedRoute>
    ),
  },
  {
    path: "/event",
    element: (
      <ProtectedRoute>
        <EventPage />
      </ProtectedRoute>
    ),
  },

  // User routes
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/dashboard",
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/event/create",
    element: (
      <ProtectedRoute>
        <UserEventRequestPage />
      </ProtectedRoute>
    ),
  },

  // Admin routes
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/event/create",
    element: (
      <ProtectedRoute>
        <AdminCreateEvent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/event/edit",
    element: (
      <ProtectedRoute>
        <AdminEventEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/event/invite",
    element: (
      <ProtectedRoute>
        <AdminEventInvite />
      </ProtectedRoute>
    ),
  },

  
  { path: "/reset", element:(
     <ProtectedRoute>
         <ResetPassword />
    </ProtectedRoute>
  ) },

  
  // {
  //   path: "*",
  //   element: <div>404 - Page Not Found</div>,
  // },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);