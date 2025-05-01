import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
const el = document.getElementById("advico-admin");

if (el) {
  ReactDOM.createRoot(el).render(
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <React.StrictMode>
        <RouterProvider router={router} />
        <Toaster />
      </React.StrictMode>
    </ThemeProvider>,
  );
}
