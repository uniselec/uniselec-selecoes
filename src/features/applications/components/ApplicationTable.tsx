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

function formatDate(dateString: string | undefined) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

export function ApplicationTable({ applications, isFetching }: Props) {


  if (isFetching) {
    return <Typography>Carregando inscrições...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {applications?.data.length === 0 ? (
        <Card sx={{ minWidth: "100%" }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Nenhuma inscrição encontrada
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {applications?.data?.map((value, key) => (
            <Grid item xs={12} md={6} lg={4} key={key}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {value?.data?.course}
                  </Typography>
                  <Typography color="text.secondary">
                    Nome Completo: {value.data.name}
                  </Typography>
                  <Typography color="text.secondary">
                    Nome Social: {value.data.social_name || "Não informado"}
                  </Typography>
                  <Typography color="text.secondary">
                    CPF: {value.data.cpf}
                  </Typography>
                  <Typography color="text.secondary">
                    Data de Nascimento: {formatDate(value.data.birtdate)}
                  </Typography>
                  <Typography color="text.secondary">
                    Sexo: {value.data.sex}
                  </Typography>
                  <Typography color="text.secondary">
                    Telefone 1: {value.data.phone1}
                  </Typography>
                  <Typography color="text.secondary">
                    Endereço: {value.data.address}
                  </Typography>
                  <Typography color="text.secondary">
                    UF: {value.data.uf}
                  </Typography>
                  <Typography color="text.secondary">
                    Cidade: {value.data.city}
                  </Typography>
                  <Typography color="text.secondary">
                    Curso Pretendido: {value.data.course}
                  </Typography>
                  <Typography color="text.secondary">
                    Local de Oferta: {value.data.campus}
                  </Typography>
                  <Typography color="text.secondary">
                    Número de Inscrição do ENEM: {value.data.enem}
                  </Typography>
                  <Typography color="text.secondary">
                    Modalidades: {value.data.vaga?.join(", ") || "Não informado"}
                  </Typography>
                  <Typography color="text.secondary">
                    Critérios de Bonificação: {value.data.bonus?.join(", ") || "Não informado"}
                  </Typography>
                </CardContent>
                {/* <CardActions>
                  <Button size="small" variant="contained" component={Link} to={`/applications/edit/${value.id}`}>
                    Alterar Inscrição
                  </Button>
                </CardActions> */}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
