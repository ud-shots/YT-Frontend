import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useLoader } from '../Common/Loader/useLoader';

const SecureRoutes: React.FC = () => {
  const [auth, setAuth] = useState<boolean | null>(null); // null means "still checking"
  const { startLoading, stopLoading } = useLoader();

  useEffect(() => {
    const checkAuth = async () => {
      startLoading(); // Start global loader
      try {
        const token = localStorage.getItem('token');
        setAuth(!!token); // true if token exists
      } catch (error) {
        console.error("Error fetching token:", error);
        setAuth(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (auth !== null) {
      stopLoading(); // Stop loader once auth is determined
    }
  }, [auth]);

  if (auth === null) return null; // Don't render anything, just show global loader

  if (!auth) return <Navigate to="/sign-in" />;
  
  return (
    <>
      <Outlet />
    </>
  );
};

export default SecureRoutes;