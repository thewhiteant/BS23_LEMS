import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import ForgotPassword from "./pages/auth/forgatePassowrd";
import ResetPassword from "./pages/auth/resetPassword";

import InvitePage from "./pages/users/invitePage";
import ProfilePage from "./pages/users/profile";
import UserDashboard from "./pages/users/dashboard";
import UserEventRequestPage from "./pages/users/eventRequest";

import AdminDashboard from "./pages/admin/adminDashboard";
import AdminCreateEvent from "./pages/admin/adminEventCreate";
import AdminEventEdit from "./pages/admin/adminEventEdit";
import AdminEventInvite from "./pages/admin/adminEventInvite";
import EventRSVPPage from "./pages/admin/eventRSVPPage";

import Dashbord from "./pages/event/dashboard";
import EventPage from "./pages/event/eventPage";

import ProtectedRoute from "./components/protectedRoute";
import Logout from "./components/logout";
import InviteManagement from "./pages/admin/inviteManagement";

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center text-2xl text-red-600">
    🚫 Admin Access Only
  </div>
);

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot", element: <ForgotPassword /> },
  { path: "/reset", element: <ResetPassword /> },
  { path: "/invite/:token", element: <InvitePage /> },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashbord />
      </ProtectedRoute>
    ),
  },
  {
    path: "/event/:id",
    element: (
      <ProtectedRoute>
        <EventPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/profile",
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

  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/event/create",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminCreateEvent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/event/edit/:id",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminEventEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/event/invite",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminEventInvite />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/invite-management",
    element: (
      <ProtectedRoute adminOnly={true}>
        <InviteManagement />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/event/rsvp-list/:id",
    element: (
      <ProtectedRoute adminOnly={true}>
        <EventRSVPPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/logout",
    element: (
      <ProtectedRoute>
        <Logout />
      </ProtectedRoute>
    ),
  },

  { path: "/unauthorized", element: <Unauthorized /> },

  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        404 - Page Not Found
      </div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
