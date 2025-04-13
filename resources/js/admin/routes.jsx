import { createHashRouter } from "react-router-dom";
import ApplicationLayout from "./components/application-layout/LayoutOne";
import ErrorPage from "./pages/error/Error";
import DashboardPage from "./pages/dashboard";
import Conversions from "./pages/conversions";
import ConversionsNew from "./pages/conversions/new";

import Stats from "./pages/stats";
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
      },
      {
        path: "conversions",
        children: [
          {
            index: true,
            element: <Conversions />,
          },
          {
            path: "new/:id?", //id is optional
            element: <ConversionsNew />,
          }
        ]
      },
      {
        path: "reports/:id?", //id is optional
        element: <Stats />,
      }
    ],
  },
]);
