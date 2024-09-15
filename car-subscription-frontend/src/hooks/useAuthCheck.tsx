import { useState, useEffect } from 'react';
import axiosInstance from '@utils/constants'; // Import your configured axios instance

const useAuthCheck = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // Initial state as null for loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make an API call to validate the cookies
        const response = await axiosInstance.get("/users/validate/cookies");
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

  return isAuth;
};

export default useAuthCheck;
