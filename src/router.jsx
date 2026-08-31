import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
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
    ],
  },
]);
