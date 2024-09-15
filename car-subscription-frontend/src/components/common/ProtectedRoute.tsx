import { Navigate, useLocation } from "react-router-dom";
import useAuthCheck from '@hooks/useAuthCheck'; // Import your custom hook

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useAuthCheck(); // Use the custom hook
  const location = useLocation(); // Get the current location for redirecting

  if (isAuth === null) {
    // Loading state: you might want to show a spinner or loader here
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    // Redirect to login if not authenticated
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Render the protected content if authenticated
  return children;
};

export default ProtectedRoute;
