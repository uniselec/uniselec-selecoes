import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "../features/auth/authSlice";
const baseUrl = import.meta.env.VITE_API_URL;

export const ProtectedRouteSubscriptionRange = ({ children }: { children: React.ReactNode }) => {
  const [isInPeriod, setIsInPeriod] = useState<boolean | null>(null);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const fetchIsInPeriod = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/is-inscription-period`);
        const json = await response.json();
        setIsInPeriod(json['is-in-period']);
      } catch (error) {
        console.error("Erro ao verificar o período de inscrição:", error);
        setIsInPeriod(false);
      }
    };

    fetchIsInPeriod();
  }, []);

  if (isInPeriod === false) {
    return <Navigate to="/" />;
  }

  if (isInPeriod === null) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
