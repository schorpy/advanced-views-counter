import { createHashRouter } from "react-router-dom";
import ApplicationLayout from "./components/application-layout/LayoutOne";
import ErrorPage from "./pages/error/Error";
import DashboardPage from "./pages/dashboard";

import Settings from "./pages/settings";
import SettingsDisplay from "./pages/settings/display";

export const router = createHashRouter([
  {
    path: "/",
    element: <ApplicationLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "settings/display",
        element: <SettingsDisplay />,
      }
     
    ],
  },
]);
