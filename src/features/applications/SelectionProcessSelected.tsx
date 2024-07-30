import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemButton, Grid, Button, Link as MuiLink } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Link } from "react-router-dom";

export const SelectionProcessSelected = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", padding: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" align="center" sx={{ color: "#0d47a1", fontWeight: "bold" }}>
          Sistema de Seleção de Alunos da UNILAB
        </Typography>
      </Box>
      <Paper sx={{ p: 4, backgroundColor: "#e3f2fd" }}>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h5" sx={{ color: "#1565c0" }}>Seleções em Andamento</Typography>
          </Box>
          <Grid container spacing={2}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: "#0d47a1" }}>
                PROCESSO SELETIVO UNILAB – PERÍODO LETIVO 2024.1
              </Typography>
              <Typography variant="body2">Início: 02/08/2024 a partir das 08:00</Typography>
              <Typography variant="body2">Término: 04/08/2024 às 23:59</Typography>
              <Box mt={2}>
                <Typography variant="h6" sx={{ color: "#0d47a1" }}>Vagas ofertadas</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Campus de Baturité - CE</Typography>
                <List dense>
                  <ListItem><ListItemText primary="Medicina (CE)" /></ListItem>
                  {/* Adicione mais itens conforme necessário */}
                </List>
              </Box>
            </Grid>
            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/applications/create"
                sx={{ mb: 2 }}
              >
                Inscrições
              </Button>
              <Typography variant="h6" sx={{ color: "#0d47a1" }}>Documentos Publicados</Typography>
              <List dense>
                <ListItem>
                  <ListItemButton component="a" href="/" target="_blank">
                    <PictureAsPdfIcon sx={{ mr: 2 }} />
                    <ListItemText primary="Edital" />
                  </ListItemButton>
                </ListItem>
                {/* <ListItem>
                  <ListItemButton component="a" href="/path-to-pdf" target="_blank">
                    <PictureAsPdfIcon sx={{ mr: 2 }} />
                    <ListItemText primary="Comunicado PÓS-GREVE - DATAS DE MATRÍCULA NAS COORDENAÇÕES" />
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton component="a" href="/path-to-pdf" target="_blank">
                    <PictureAsPdfIcon sx={{ mr: 2 }} />
                    <ListItemText primary="Comunicado: ADIAMENTO DE MATRÍCULAS E DO INÍCIO AULAS - CE/BA" />
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton component="a" href="/path-to-pdf" target="_blank">
                    <PictureAsPdfIcon sx={{ mr: 2 }} />
                    <ListItemText primary="Resultado final de analise de pré-matrícula LE - Ceará" />
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton component="a" href="/path-to-pdf" target="_blank">
                    <PictureAsPdfIcon sx={{ mr: 2 }} />
                    <ListItemText primary="Resultado final de analise de pré-matrícula LE - Bahia" />
                  </ListItemButton>
                </ListItem> */}
                {/* Adicione mais documentos conforme necessário */}
              </List>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};
