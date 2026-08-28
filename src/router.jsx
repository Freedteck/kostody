import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
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
import NotificationCenter from "./pages/notifications/NotificationCenter";
import MarketingLayout from "./marketing/MarketingLayout";
import Home from "./marketing/pages/Home";
import Product from "./marketing/pages/Product";
import About from "./marketing/pages/About";
import Help from "./marketing/pages/Help";
import Privacy from "./marketing/pages/Privacy";
import Terms from "./marketing/pages/Terms";
import NotFound from "./marketing/pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <MarketingLayout />,
        children: [
          {
            path: "/",
            Component: Home,
          },
          {
            path: "/product",
            Component: Product,
          },
          {
            path: "/about",
            Component: About,
          },
          {
            path: "/help",
            Component: Help,
          },
          {
            path: "/privacy",
            Component: Privacy,
          },
          {
            path: "/terms",
            Component: Terms,
          },
          {
            path: "*",
            Component: NotFound,
          },
        ],
      },
      {
        path: "/splash",
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
              {
                path: "notifications",
                element: <NotificationCenter role="engineer" />,
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
                path: "notifications",
                element: <NotificationCenter role="customer" />,
              },
              {
                path: "profile",
                Component: CustomerProfilePage,
              },
              {
                path: "/c/:jobId",
                Component: CustomerJobPage,
              },
            ],
          },
        ],
      },
    ],
  },
]);
