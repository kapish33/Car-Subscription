import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import LoginForm from "@components/forms/login";
import NotFound from "@pages/NotFound";
import SignUpForm from "@components/forms/signup";
import Dashboard from "@/layouts/DashboardLayout";
import Subscriptions from "@components/Subscriptions";
import Schedule from "@components/Schedule";
import CreateUser from "@/components/AddUser";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/sign-in",
    element: <LoginForm />,
    errorElement: <NotFound />,
  },
  {
    path: "/sign-up",
    element: <SignUpForm />,
    errorElement: <NotFound />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ), // This will be the parent component for nested routes
    errorElement: <NotFound />,
    children: [
      {
        path: "subscriptions",
        element: <Subscriptions />, // Component for /dashboard/subscriptions
      },
      {
        path: "schedule",
        element: <Schedule />, // Component for /dashboard/schedule
      },
      {
        path: "create-user",
        element: <CreateUser />, // Component for /dashboard/settings
      },
    ],
  },
]);
