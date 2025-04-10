import React, { useState } from "react";
import {
  ListItemButton,
  Modal,
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid
} from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetProcessSelectionQuery } from "./processSelectionSlice";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useGetDocumentsByProcessSelectionQuery, useGetDocumentsQuery } from "../documents/documentSlice";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../auth/authSlice";
import { Course } from "../../types/Course"; // Certifique-se de importar o type Course corretamente.

const apiUrl = import.meta.env.VITE_API_URL;

// Definindo a interface para o grupo de campus
interface CampusGroup {
  totalVacancies: number;
  courses: Array<Course & { totalVacancies: number }>;
}

export const ProcessSelectionDetails = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isModalOpen, setModalOpen] = useState(false);
  const [options] = useState({
    page: 1,
    search: "",
    perPage: 120,
    rowsPerPage: [30, 20, 30],
  });

  const { data, isFetching: isFetchingDocuments, error } = useGetDocumentsQuery(options);

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: processSelection, isFetching } = useGetProcessSelectionQuery({ id: id! });
  const { data: documentsData } = useGetDocumentsByProcessSelectionQuery({ processSelectionId: id! });

  if (error) {
    return <Typography>Error fetching applications</Typography>;
  }
  if (isFetching) return <Typography>Carregando...</Typography>;
  if (!processSelection) return <Typography>Processo Seletivo não encontrado.</Typography>;

  // Obtém os cursos do processo
  const courses: Course[] = processSelection.data.courses || [];

  // Agrupa os cursos por campus e calcula totais:
  const campusGroups: Record<string, CampusGroup> = courses.reduce<Record<string, CampusGroup>>((groups, course) => {
    // Usando course.academic_unit.description conforme o type Course,
    // caso o type seja atualizado para usar course.campus, ajuste essa linha.
    const campus = course.academic_unit.description;
    // Se vacanciesByCategory for undefined ou null, usamos objeto vazio
    const vacanciesObj = course.vacanciesByCategory || {};
    const courseTotalVacancies = Object.values(vacanciesObj).reduce((sum, qty) => sum + qty, 0);

    if (groups[campus]) {
      groups[campus].totalVacancies += courseTotalVacancies;
      groups[campus].courses.push({ ...course, totalVacancies: courseTotalVacancies });
    } else {
      groups[campus] = {
        totalVacancies: courseTotalVacancies,
        courses: [{ ...course, totalVacancies: courseTotalVacancies }]
      };
    }
    return groups;
  }, {} as Record<string, CampusGroup>);

  const determineButtonLink = () => {
    if (!isAuthenticated) {
      return "/register";
    }
    return `/applications/create/${id}`;
  };

  const handleApply = () => {
    navigate(isAuthenticated ? "/applications" : "/applications/create");
  };

  const handleClose = () => setModalOpen(false);

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
            {/* Coluna Esquerda */}
            <Grid item xs={12} lg={6}>
              <Typography variant="h6" sx={{ color: "#0d47a1" }}>
                {processSelection.data.name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {processSelection.data.description}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Início: {new Date(processSelection.data.start_date).toLocaleDateString('pt-BR')} às {new Date(processSelection.data.start_date).toLocaleTimeString('pt-BR')}
              </Typography>
              <Typography variant="body2">
                Término: {new Date(processSelection.data.end_date).toLocaleDateString('pt-BR')} às {new Date(processSelection.data.end_date).toLocaleTimeString('pt-BR')}
              </Typography>
              <Box mt={2}>
                <Typography variant="h6" sx={{ color: "#0d47a1" }}>
                  Vagas ofertadas agrupadas por Campus
                </Typography>
                {Object.keys(campusGroups).length > 0 ? (
                  <List>
                    {Object.entries(campusGroups).map(([campus, group]) => (
                      <ListItem key={campus} disableGutters>
                        <Box sx={{ width: "100%" }}>
                          <ListItemText
                            primary={`${campus} - Total de vagas: ${group.totalVacancies}`}
                          />
                          {/* Lista de cursos deste campus */}
                          <List sx={{ pl: 4 }}>
                            {group.courses.map((course) => (
                              <ListItem key={course.id}>
                                <ListItemText
                                  primary={course.name}
                                  secondary={`Vagas: ${course.totalVacancies}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography>Nenhum curso vinculado.</Typography>
                )}
              </Box>
            </Grid>
            {/* Coluna Direita */}
            <Grid item xs={12} lg={6}>
              {processSelection.data.type !== "sisu" && (
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={determineButtonLink()}
                  sx={{ mb: 2 }}
                >
                  Inscrições
                </Button>
              )}
              <Typography variant="h6" sx={{ color: "#0d47a1" }}>Documentos Publicados</Typography>
              <List dense>
                {documentsData && documentsData.data.length > 0 ? (
                  documentsData.data.map((doc) => (
                    <ListItem key={doc.id}>
                      <ListItemButton component="a" href={`${apiUrl}/storage/${doc.path}`} target="_blank">
                        <PictureAsPdfIcon sx={{ mr: 2 }} />
                        <ListItemText
                          primary={doc.title}
                          secondary={
                            doc.created_at
                              ? new Date(doc.created_at).toLocaleString()
                              : 'Data não disponível'
                          }
                        />
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
          <Typography id="modal-description" sx={{ mt: 2 }}>
            As inscrições estarão abertas de {new Date(processSelection.data.start_date).toLocaleDateString('pt-BR')} a partir das {new Date(processSelection.data.start_date).toLocaleTimeString('pt-BR')} até {new Date(processSelection.data.end_date).toLocaleDateString('pt-BR')} às {new Date(processSelection.data.end_date).toLocaleTimeString('pt-BR')}.
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};
