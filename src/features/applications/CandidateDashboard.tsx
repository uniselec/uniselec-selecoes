// src/features/applications/CandidateDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  logOut,
  selectAuthUser,
  selectIsAuthenticated,
} from "../auth/authSlice";
import { useSendLogOutMutation } from "../auth/authApiSlice";
import { Register } from "../auth/Register";
import { useGetApplicationsQuery } from "./applicationSlice";
import { Login } from "../auth/Login";
import { RootState } from "../../app/store";


const CandidateDashboard: React.FC = () => {
  const token = useAppSelector((state: RootState) => state.auth.token);
  const userAuth = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [logout, statusLogout] = useSendLogOutMutation();
  const handleLogout = () => {
    logout({});
    dispatch(logOut());
  };
  useEffect(() => {
    if (statusLogout.isSuccess) {
      enqueueSnackbar("Logout realizado", { variant: "success" });
      navigate("/");
    }
    if (statusLogout.error) {
      enqueueSnackbar("Falha no logout", { variant: "error" });
    }
  }, [enqueueSnackbar, statusLogout, navigate]);




  const [options] = useState({ page: 1, perPage: 20, search: "" });
  const {
    data: applicationsResponse,
    isFetching,
    error,
    refetch,
  } = useGetApplicationsQuery(options, {
    skip: !token,            // só dispara se já existe token
  });
  useEffect(() => {
    if (token) {
      refetch();             // garante nova chamada já com /api/client e Authorization
    }
  }, [token, refetch]);
  /* ------------ UI helpers ------------ */
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  /* ------------ snackbar demo para edição (placeholder) ------------ */
  const [editOpen, setEditOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const handleSaveProfile = () => {
    setEditOpen(false);
    setSnackOpen(true);
  };

  if (!isAuthenticated) return <Login />;
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Portal do Candidato</Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {/* Conteúdo */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Resumo do candidato */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 56, height: 56 }}>
                {userAuth?.name?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h6" gutterBottom>
                {userAuth?.name}
              </Typography>
              <Typography>{userAuth?.email}</Typography>
              <Typography variant="body2" color="text.secondary">
                {userAuth?.cpf}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Lista de inscrições */}
        <Typography variant="h6" gutterBottom>
          Minhas Inscrições
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {isFetching && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Não foi possível carregar suas inscrições.
          </Alert>
        )}

        {(applicationsResponse?.data ?? []).map((app: any) => (
          <Accordion key={app.id} sx={{ mb: 1, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <SchoolIcon fontSize="small" />
                </Grid>
                <Grid item xs>
                  <Typography>{app.data.position}</Typography>
                  {isSmUp && (
                    <Typography variant="caption" color="text.secondary">
                      Enviada em{" "}
                      {new Date(app.created_at).toLocaleDateString("pt-BR")}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" gutterBottom>
                <strong>Data de envio:</strong>{" "}
                {new Date(app.created_at).toLocaleDateString("pt-BR")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Campus: {app.data.location_position}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Diálogo de edição (placeholder) */}
      <EditProfileDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Dados atualizados!
        </Alert>
      </Snackbar>
    </Box>
  );
};

/* ---------- Diálogo de edição ---------- */
interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}
const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onClose,
  onSave,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Editar Perfil</DialogTitle>
    <DialogContent dividers sx={{ pt: 2 }}>
      {/* coloque campos de edição se/quando precisar */}
      <TextField label="Nome" fullWidth sx={{ mb: 2 }} disabled />
      <TextField label="E-mail" fullWidth sx={{ mb: 2 }} disabled />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="contained" onClick={onSave}>
        Salvar
      </Button>
    </DialogActions>
  </Dialog>
);

export { CandidateDashboard };
