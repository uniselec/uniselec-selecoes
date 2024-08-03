import React from "react";
import { useGetStudentSelectionQuery } from '../features/studentSelection/studentSelectionSlice';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const ProtectedRoutePeriod = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isLoading } = useGetStudentSelectionQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  const isInPeriod = data?.studentSelection?.isInPeriod ?? false;
  const start = data?.studentSelection?.start;
  const end = data?.studentSelection?.end;

  if (!isInPeriod) {
    return (
      <Card style={{ maxWidth: 400, margin: 'auto', marginTop: '2rem' }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Não estamos no período de inscrições
          </Typography>
          <Typography variant="body2" component="p" style={{ marginBottom: '1rem' }}>
            {start && end ? (
              <>O período de inscrições foi de {new Date(start).toLocaleString('pt-PT')} até {new Date(end).toLocaleString('pt-PT')}.</>
            ) : (
              <>As datas do período de inscrições serão anunciadas em breve.</>
            )}
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/">
            Voltar para a Página Inicial
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
