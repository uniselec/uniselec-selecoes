import React, { useState, useEffect } from "react";
import { ListItemButton, Modal, Box, Paper, Typography, Button, List, ListItem, ListItemText, Grid, Card, CardContent, CardActions } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProcessSelectionQuery } from "./processSelectionSlice";


import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useGetDocumentsByProcessSelectionQuery, useGetDocumentsQuery } from "../documents/documentSlice";
import { Link } from "react-router-dom";
import { selectIsAuthenticated } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { useGetApplicationsQuery } from "../applications/applicationSlice";
import { useGetStudentSelectionQuery } from "../studentSelection/studentSelectionSlice";
import { Document } from "../../types/Document";
const apiUrl = import.meta.env.VITE_API_URL;


export const ProcessSelectionDetails = () => {



  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isModalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 120,
    rowsPerPage: [30, 20, 30],
  });


  const { data, isFetching: isFetchingDocuments, error } = useGetDocumentsQuery(options);
  // const { data: dataApplication, isFetching: isFetchingApplications, error: errorApplications } = useGetApplicationsQuery(options);


  const determineButtonLink = () => {
    if (!isAuthenticated) {
      return "/register";
    }
    // if (studentSelectionData?.studentSelection?.isInPeriod && dataApplication?.data?.length === 0) {
    //   return "/applications/create";
    // }
    return "/applications";
  };

  const now = new Date();
  const handleClose = () => setModalOpen(false);

  if (error) {
    return <Typography>Error fetching applications</Typography>;
  }


  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: processSelection, isFetching } = useGetProcessSelectionQuery({ id: id! });

  const { data: documentsData, isFetching: isFetchingDocumentsByProcessSelection, refetch } = useGetDocumentsByProcessSelectionQuery({ processSelectionId: id! });



  const [registered] = useState(false);

  if (isFetching) return <Typography>Carregando...</Typography>;
  if (!processSelection) return <Typography>Processo Seletivo não encontrado.</Typography>;

  const courses = processSelection.data.courses || [];

  const handleApply = () => {
    navigate(registered ? "/applications" : "/applications/create");
  };

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
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <Typography variant="h6" sx={{ color: "#0d47a1" }}>
                {processSelection.data.name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {processSelection.data.description}
              </Typography>

              <>
                <Typography variant="body2">
                  Início: {new Date(processSelection.data.start_date).toLocaleDateString('pt-BR')} a partir das {new Date(processSelection.data.start_date).toLocaleTimeString('pt-BR')}
                </Typography>
                <Typography variant="body2">
                  Término: {new Date(processSelection.data.end_date).toLocaleDateString('pt-BR')} às {new Date(processSelection.data.end_date).toLocaleTimeString('pt-BR')}
                </Typography>
              </>

              <Box mt={2}>
                <Typography variant="h6" sx={{ color: "#0d47a1" }}>Vagas ofertadas</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Campus de Baturité - CE</Typography>
                {courses.length > 0 ? (
                  <List>
                    {courses.map((course: any) => (
                      <ListItem key={course.id}>
                        <ListItemText
                          primary={`${course.name} - ${course.campus} (${course.state})`}
                          secondary={`Vagas: ${course.vacancies}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography>Nenhum curso vinculado.</Typography>
                )}
              </Box>
            </Grid>
            {/* Right Column */}
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>

              {processSelection.data.type != "sisu" && (<Button
                variant="contained"
                color="primary"
                component={Link}
                to={determineButtonLink()}
                sx={{ mb: 2 }}
              >
                Inscrições
              </Button>)}



              <Typography variant="h6" sx={{ color: "#0d47a1" }}>Documentos Publicados</Typography>

              <List dense>


                {documentsData && documentsData.data.length > 0 ? (
                  documentsData.data.map((doc: Document, index: number) => (
                    <ListItem key={doc.id}>
                      <ListItemButton component="a" href={`${apiUrl}/storage/${doc.path}`} target="_blank">
                        <PictureAsPdfIcon sx={{ mr: 2 }} />
                        <ListItemText primary={doc.title} secondary={doc.created_at ? new Date(doc.created_at).toLocaleString() : 'Data não disponível'} />

                      </ListItemButton>
                    </ListItem>

                  ))
                ) : (
                  <Typography>Nenhum documento cadastrado.</Typography>
                )}


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

          <>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              As inscrições estarão abertas de {new Date(processSelection.data.start_date).toLocaleDateString('pt-BR')} a partir das {new Date(processSelection.data.start_date).toLocaleTimeString('pt-BR')} até  {new Date(processSelection.data.end_date).toLocaleDateString('pt-BR')} às {new Date(processSelection.data.end_date).toLocaleTimeString('pt-BR')}.
            </Typography>
          </>

        </Box>
      </Modal>

    </Box>


  );
};
