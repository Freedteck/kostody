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
    path: "/app",
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
    ],
  },

  {
    path: "/c/:jobId",
    Component: CustomerJobPage,
  },
]);
