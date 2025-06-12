// src/main.tsx (or index.tsx)
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";

import LandingPage from "./pages/home/LandingPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";

// Auth
import AuthPage from "./pages/auth/page.tsx";
import GetStartedPage from "./pages/auth/GetStartedPage.tsx";
import VerificationPage from "./pages/auth/VerificationPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import ResendVerification from "./pages/auth/ResendPage.tsx";
import ForgotPassword from "./pages/auth/ForgotPasswordPage.tsx";
import ChangePassword from "./pages/auth/ChangePasswordPage.tsx";
import ConfirmEmailPage from "./pages/auth/ConfirmEmailPage";


// Profile
import ProfileLayout from "./pages/profile/page.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";

// Contexts
import { ThemeProvider } from "./context/ThemeContexts.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { CauseProvider } from "./context/CauseContext.tsx";
import DashboardPage from "./pages/dashboard/DashboardPage.tsx";

import CauseDetail from "./pages/dashboard/cause/CauseDetail";

import MyInvites from './pages/dashboard/invites/MyInvites.tsx'
import InviteAcceptPage from './pages/dashboard/invites/InviteAcceptPage.tsx'
import EligibilityChecker from "./pages/dashboard/lead/eligibilityChecker/EligibilityChecker.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

import LeaderProfilePage from "./pages/dashboard/know/components/LeaderProfilePage.tsx";

import AdvocacyDetail from "./pages/dashboard/organise/components/AdvocacyDetail.tsx";

import NewCausePage from "./pages/dashboard/cause/NewCausePage.tsx";

import PUInfoPage from "./pages/dashboard/elections/monitor/pages/PUInfoPage.tsx";
import ResultTrackingPage from "./pages/dashboard/elections/monitor/pages/ResultTrackingPage.tsx";
import IncidentReportingPage from "./pages/dashboard/elections/monitor/pages/IncidentReportingPage.tsx";
import OfficerVerificationPage from "./pages/dashboard/elections/monitor/pages/OfficerVerificationPage.tsx";
import PublicCauseDetail from "./pages/dashboard/cause/PublicCauseDetail.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <LandingPage />
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
    children: [
      { path: "sign-up", element: <GetStartedPage /> },
      { path: "verify", element: <VerificationPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "resend", element: <ResendVerification /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "confirm-email/:token", element: <ConfirmEmailPage /> },
    ],
  },
  {
    path: "/profile",
    element: (
      <UserProvider>
        <ProfileLayout />
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <ProfilePage /> }],
  },
  {
    path: "/dashboard",
    element: (
      <UserProvider>
        <DashboardPage />
      </UserProvider>
    ),
  },
  {
    path: '/dashboard/invites',
    element: <UserProvider><MyInvites /></UserProvider>
  },
  {
    path: "/causes/:id",
    element: (
      <UserProvider>
        <CauseDetail />
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/advocacy/:id",
    element: (
      <UserProvider>
        <ProtectedRoute>
          <AdvocacyDetail />
        </ProtectedRoute>
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/invite/:token',
    element: <InviteAcceptPage />
  },
  {
    path: "/run-for-office/eligibility",
    element: (
      <UserProvider>
        <ProtectedRoute>
          <EligibilityChecker />
        </ProtectedRoute>
      </UserProvider>
    ),
  },
  {
    path: "/leaders/:slug",
    element: <LeaderProfilePage />
  },
  {
    path: "/monitor/polling-unit",
    element: (
      <UserProvider>
        <ProtectedRoute>
          <PUInfoPage />
        </ProtectedRoute>
      </UserProvider>
    ),
  },
  {
    path: "/monitor/officer-arrival",
    element: (
      <UserProvider>
        <ProtectedRoute>
          <OfficerVerificationPage />
        </ProtectedRoute>
      </UserProvider>
    ),
  },

  // Cause Links 
  {
    path: "/dashboard/new-cause",
    element: (
      <UserProvider>
        <ProtectedRoute>
          <NewCausePage />
        </ProtectedRoute>
      </UserProvider>
    ),
  },
  {
    path: "/cause/:code",
    element: (
      <UserProvider>
        <CauseProvider>
          <PublicCauseDetail />
        </CauseProvider>
      </UserProvider>
    ),
  },

  {
    path: "/monitor/result-tracking",
    element: (
      <UserProvider>
        <ProtectedRoute>
          <ResultTrackingPage />
        </ProtectedRoute>
      </UserProvider>
    ),
  },
  {
    path: "/monitor/incident-reporting",
    element: (
      <UserProvider>
        <ProtectedRoute>
          <IncidentReportingPage />
        </ProtectedRoute>
      </UserProvider>
    ),
  },


]);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
