import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "../features/auth/authSlice";
const baseUrl = import.meta.env.VITE_API_URL;


export const ProtectedRouteSubscriptionRange = ({ children }: { children: React.ReactNode }) => {
  const [registrationStartDate, setRegistrationStartDate] = useState<Date | null>(null);
  const [registrationEndDate, setRegistrationEndDate] = useState<Date | null>(null);
  const now = new Date();
  useEffect(() => {

    const fetchRegistrationDates = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/inscription-period`);
        const json = await response.json();
        setRegistrationStartDate(new Date(json.start));
        setRegistrationEndDate(new Date(json.end));
      } catch (error) {
        console.error("Erro ao buscar as datas de inscrição:", error);
      }
    };

    fetchRegistrationDates();
  }, []);

  const isAuthenticated = useSelector(selectIsAuthenticated);


  if (registrationEndDate != null && registrationStartDate != null) {
    if (!(
      registrationStartDate &&
      registrationEndDate &&
      now >= registrationStartDate &&
      now <= registrationEndDate
    )) {
      return <Navigate to="/" />;
    }
  }


  return <>{children}</>;
};