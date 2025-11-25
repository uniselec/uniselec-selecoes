import { useParams, useNavigate } from "react-router-dom";
import Logo from "../../../assets/img/logo-unilab-preto.png";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import LogoutIcon from '@mui/icons-material/Logout';
import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Paper, Grid, Avatar,
  Divider, Accordion, AccordionSummary, AccordionDetails,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  logOut, selectAuthUser, selectIsAuthenticated,
} from '../auth/authSlice';
import { useSendLogOutMutation } from '../auth/authApiSlice';
import { Login } from '../auth/Login';
import { styled } from '@mui/material/styles';
import { AppealForm } from "./components/AppealForm";
import { Appeal as AppealType } from "../../types/Appeal";
import { useGetApplicationQuery } from "../applications/applicationSlice";
import { AppealReview } from "./components/AppealReview";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGetProcessSelectionQuery } from "../processSelections/processSelectionSlice";

const Appeal: React.FC = () => {

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (!isAuthenticated) return <Login />;

  const dispatch = useAppDispatch();
  const [logout, logoutStatus] = useSendLogOutMutation();
  const doLogout = () => { logout({}); dispatch(logOut()); };
  const userAuth = useAppSelector(selectAuthUser);

  const { id: applicationId } = useParams<{ id: string }>();
  if (!applicationId) {
    return <Typography>Parâmetro da aplicação ausente.</Typography>;
  }
  const { data: application, isLoading, isFetching } = useGetApplicationQuery({ id: applicationId });

  const processSelectionId = application?.data?.process_selection_id;

  const { data: processSelection } = useGetProcessSelectionQuery(
    { id: processSelectionId as string },
    { skip: !processSelectionId }
  );
    
  const [view, setView] = useState<"form" | "review">("form");
  const [isCreate, setIsCreate] = useState(true);
  const [appeal, setAppeal] = useState<AppealType>({
    application_id: " ",
    justification: " "
  });

  useEffect(() => {
    if (application?.data['appeal']) {
      setAppeal(application.data['appeal']);
      setIsCreate(false);
    }
  }, [application])

  const isAppealReviewed = () => {
    if (appeal?.status === "accepted" || appeal?.status === "rejected") {
      return true;
    }
    return false;
  }

  const isAppealPeriodOver = () => {

    if (!processSelection) return false;

    const appealStartDate = processSelection.data['appeal_start_date'];
    const appealEndDate = processSelection.data['appeal_end_date'];

    if (!appealStartDate || !appealEndDate) return false;
    
    const end = new Date(appealEndDate);
    if (isNaN(end.getTime())) return false;
    
    const now = new Date();

    return now > end;
  };

  if (isFetching) return <Typography>Carregando…</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

      {/* Barra topo */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Portal do Candidato</Typography>
          <Box>
            <Button
              sx={{mr:3}}
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={() => view === "review" ? setView('form') : window.history.back()}
            >
              Voltar
            </Button>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={doLogout}>
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Cabeçalho do candidato */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }} elevation={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 56, height: 56 }}>
                {userAuth?.name?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h6">{userAuth?.name}</Typography>
              <Typography>{userAuth?.email}</Typography>
              <Typography variant="body2" color="text.secondary">
                {userAuth?.cpf}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Recurso — título + status + botão */}
      <Box sx={{ mb: 2 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">{view === "form" ? "Recurso" : "Comentário do Avaliador"}</Typography>
          </Grid>

          <Grid item>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

              {/* STATUS DO RECURSO */}
              <Typography
                variant="body1"
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  // bgcolor:
                  //   appeal?.status === "accepted" ? "success.light" :
                  //   appeal?.status === "rejected" ? "error.light" :
                  //   appeal?.status === "submitted" ? "warning.light" :
                  //   "grey.300",
                  color:
                    appeal?.status === "accepted" ? "success.dark" :
                      appeal?.status === "rejected" ? "error.dark" :
                        appeal?.status === "submitted" ? "warning.dark" :
                          "grey.800",
                  fontWeight: 600,
                  textTransform: "capitalize"
                }}
              >
                {view === "form" && (appeal?.status
                  ? ({
                    submitted: "Enviado",
                    accepted: "Aceito",
                    rejected: "Rejeitado"
                  } as any)[appeal.status] || "Não enviado"
                  : "Não enviado")}
              </Typography>

              {/* BOTÃO PARA COMENTÁRIO DO AVALIADOR */}
              {(isAppealReviewed() && appeal?.decision) && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setView(view === "form" ? "review" : "form")}
                >
                  {view === "form" ? "Ver comentário" : "Ver recurso"}
                </Button>
              )}

            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {view === "form" ? (
        <AppealForm
          applicationId={applicationId}
          isCreate={isCreate}
          setIsCreate={setIsCreate}
          appeal={appeal}
          setAppeal={setAppeal}
          isAppealReviewed={isAppealReviewed}
          isAppealPeriodOver={isAppealPeriodOver}
        />
      ) : (
        <AppealReview
          appeal={appeal}
        />
      )}
    </Box>
  )};

export { Appeal };