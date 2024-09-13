import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axiosInstance from "@/utils/constants"; // Import your configured axios instance

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // Initial state as null for loading
  const location = useLocation(); // Get the current location for redirecting

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make an API call to validate the cookies
        const response = await axiosInstance.get("/validate/cookies");
        console.log("response",response.data)
        if (response.status === 200) {
          setIsAuth(true); // Set authenticated if response is successful
        } else {
          setIsAuth(false); // Set not authenticated if response is not successful
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuth(false); // Set not authenticated on error
      }
    };

    checkAuth();
  }, []);

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
