import { Typography, Box, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { Results } from "../../../types/Application";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

type Props = {
  applications: Results | undefined;
  isFetching: boolean;
};

export function ApplicationTable({ applications, isFetching }: Props) {
  const rowCount = applications?.meta.total || 0;

  if (isFetching) {
    return <Typography>Carregando inscrições...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {applications?.data.length === 0 ? (
        <Card sx={{ minWidth: "100%" }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Nenhuma inscrição encontrada, clique aqui para realizar sua inscrição
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant="contained" component={Link} to="/applications/create">
              Realizar Inscrição
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {applications?.data?.map((value, key) => (
            <Grid item xs={12} md={6} lg={4} key={key}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {value.name}
                  </Typography>
                  <Typography color="text.secondary">
                    CPF: {value.data.cpf}
                  </Typography>
                  <Typography color="text.secondary">
                    Curso: {value.data.course}
                  </Typography>
                  <Typography color="text.secondary">
                    Local de Oferta: {value.data.campus}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" component={Link} to={`/applications/edit/${value.id}`}>
                    Alterar Inscrição
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
