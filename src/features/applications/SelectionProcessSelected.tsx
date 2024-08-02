import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemButton, Grid, Button, Modal } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useGetDocumentsQuery } from "../documents/documentSlice";
import { Link } from "react-router-dom";
import { selectIsAuthenticated } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { useGetApplicationsQuery } from "./applicationSlice";
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';


const baseUrl = import.meta.env.VITE_API_URL;

export const SelectionProcessSelected = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isModalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 10,
    rowsPerPage: [10, 20, 30],
  });
  const [registrationStartDate, setRegistrationStartDate] = useState<Date | null>(null);
  const [registrationEndDate, setRegistrationEndDate] = useState<Date | null>(null);
  const { data: dataApplication, isFetching: isFetchingApplications, error: errorApplications } = useGetApplicationsQuery(options);
  const { data, isFetching, error } = useGetDocumentsQuery(options);

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

  const now = new Date();

  const handleClose = () => setModalOpen(false);

  if (error) {
    return <Typography>Error fetching applications</Typography>;
  }

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
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6} >
              <Typography variant="h6" sx={{ color: "#0d47a1" }}>
                PROCESSO SELETIVO UNILAB – PERÍODO LETIVO 2024.1
              </Typography>
              {registrationStartDate && registrationEndDate && (
                <>
                  <Typography variant="body2">
                    Início: {registrationStartDate.toLocaleDateString('pt-BR')} a partir das {registrationStartDate.toLocaleTimeString('pt-BR')}
                  </Typography>
                  <Typography variant="body2">
                    Término: {registrationEndDate.toLocaleDateString('pt-BR')} às {registrationEndDate.toLocaleTimeString('pt-BR')}
                  </Typography>
                </>
              )}
              <Box mt={2}>
                <Typography variant="h6" sx={{ color: "#0d47a1" }}>Vagas ofertadas</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Campus de Baturité - CE</Typography>
                <List dense>
                  <ListItem><ListItemText primary="Medicina (CE)" /></ListItem>
                </List>
              </Box>
            </Grid>
            {/* Right Column */}
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6} >

              {!(
                registrationStartDate &&
                registrationEndDate &&
                now >= registrationStartDate
              ) ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setModalOpen(true);
                  }}
                  sx={{ mb: 2 }}
                >
                  Inscrições
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={(() => {
                    if (!isAuthenticated) {
                      return "/register";
                    }
                    if (dataApplication?.data.length === 0) {
                      return "/applications/create";
                    }
                    return "/applications";
                  })()}
                  sx={{ mb: 2 }}
                >
                  Inscrições
                </Button>
              )}

              <Typography variant="h6" sx={{ color: "#0d47a1" }}>Documentos Publicados</Typography>
              <List dense>
                {data?.data.map((document) => (
                  <ListItem key={document.id}>
                    <ListItemButton component="a" href={`${baseUrl}/storage/${document.path}`} target="_blank">
                      <PictureAsPdfIcon sx={{ mr: 2 }} />
                      <ListItemText primary={document.title} secondary={document.description} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            outline: 'none',
          }}
        >
          {registrationStartDate && registrationEndDate && (
            <>
              <Typography id="modal-description" sx={{ mt: 2 }}>
                As inscrições estarão abertas de {registrationStartDate.toLocaleDateString('pt-BR')} a partir das {registrationStartDate.toLocaleTimeString('pt-BR')} até  {registrationEndDate.toLocaleDateString('pt-BR')} às {registrationEndDate.toLocaleTimeString('pt-BR')}.
              </Typography>
            </>
          )}

        </Box>
      </Modal>
    </Box>
  );
};
