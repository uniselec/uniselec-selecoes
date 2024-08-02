import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "../features/auth/authSlice";
const baseUrl = import.meta.env.VITE_API_URL;

export const ProtectedRouteBeforeStart = ({ children }: { children: React.ReactNode }) => {
  const [isAfterStart, setIsAfterStart] = useState<boolean | null>(null);
  useEffect(() => {
    const fetchIsAfterStart = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/is-after-start-period`);
        const json = await response.json();
        setIsAfterStart(json['is-after-start']);
      } catch (error) {
        console.error("Erro ao verificar o início do período de inscrição:", error);
      }
    };

    fetchIsAfterStart();
  }, []);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAfterStart === null) {
    return <div>Carregando...</div>;
  }

  if (!isAfterStart) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
