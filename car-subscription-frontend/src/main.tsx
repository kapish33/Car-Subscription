import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import {
  RouterProvider,
} from "react-router-dom";
import { router } from "@utils/rooutes.tsx";
import { Toaster } from "@components/ui/toaster";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>
);
