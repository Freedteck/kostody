import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Intake from "./pages/intake/Intake";
import JobDetailsPage from "./pages/jobDetails/JobDetails";
import Splash from "./pages/splash/Splash";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import JobSummaryPage from "./pages/jobSummary/JobSummary";
import CustomerJobPage from "./pages/customerJob/CustomerJob";
import HistoryPage from "./pages/history/History";
import ProfilePage from "./pages/profile/Profile";
import Dashboard from "./pages/dashboard/Dashboard";
import CustomerLogin from "./pages/customerLogin/CustomerLogin";
import CustomerApp from "./CustomerApp";
import CustomerDashboard from "./pages/customerDashboard/CustomerDashboard";
import CustomerProfilePage from "./pages/customerProfile/CustomerProfile";
import CustomerHistoryPage from "./pages/customerHistory/CustomerHistory";
import AuthGuard from "./components/auth/AuthGuard";
import EditProfile from "./components/editProfile/EditProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Splash,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/c/login",
    Component: CustomerLogin,
  },
  {
    path: "/c/:jobId",
    Component: CustomerJobPage,
  },
  {
    path: "/app",
    element: <AuthGuard requiredRole="ENGINEER" />,
    children: [
      {
        Component: App,
        children: [
          {
            path: "dashboard",
            Component: Dashboard,
          },
          {
            path: "intake",
            Component: Intake,
          },
          {
            path: "summary",
            Component: JobSummaryPage,
          },
          {
            path: "job/:jobId",
            Component: JobDetailsPage,
          },
          {
            path: "history",
            Component: HistoryPage,
          },
          {
            path: "profile",
            Component: ProfilePage,
          },
          {
            path: "profile/edit",
            Component: EditProfile,
          },
        ],
      },
    ],
  },
  {
    path: "/c",
    element: <AuthGuard requiredRole="CUSTOMER" />,
    children: [
      {
        Component: CustomerApp,
        children: [
          {
            path: "dashboard",
            Component: CustomerDashboard,
          },
          {
            path: "history",
            Component: CustomerHistoryPage,
          },
          {
            path: "profile",
            Component: CustomerProfilePage,
          },
        ],
      },
    ],
  },
]);
