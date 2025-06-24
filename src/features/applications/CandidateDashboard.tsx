import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Paper, Grid, Avatar,
  Divider, Accordion, AccordionSummary, AccordionDetails,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress, IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon   from '@mui/icons-material/Logout';
import SchoolIcon   from '@mui/icons-material/School';
import EditIcon     from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import {
  logOut, selectAuthUser, selectIsAuthenticated,
} from '../auth/authSlice';
import { useSendLogOutMutation } from '../auth/authApiSlice';
import { useGetApplicationsQuery } from './applicationSlice';
import { Application } from '../../types/Application';
import { Login } from '../auth/Login';
import { RootState } from '../../app/store';

const CandidateDashboard = () => {
  /* ---------------- auth / logout ---------------- */
  const dispatch       = useAppDispatch();
  const navigate       = useNavigate();
  const token          = useAppSelector((s: RootState) => s.auth.token);
  const userAuth       = useAppSelector(selectAuthUser);
  const isAuthenticated= useAppSelector(selectIsAuthenticated);
  const [logout, logoutStatus] = useSendLogOutMutation();

  const doLogout = () => { logout({}); dispatch(logOut()); };

  /* ---------------- applications ----------------- */
  const { data: appsResp, isFetching, error } = useGetApplicationsQuery(
    { page: 1, perPage: 100, search: '' },          // perPage generoso
    { skip: !token }                                // só após token
  );

  /* ---------------- UI helpers ------------------- */
  const [snackOpen, setSnackOpen]   = React.useState(false);
  const [editDlg, setEditDlg]       = React.useState(false);

  if (!isAuthenticated) return <Login />;

  /* ------------- render ------------- */
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Barra topo */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Portal do Candidato</Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={doLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Cabeçalho do candidato */}
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

        {/* Lista de inscrições */}
        <Typography variant="h6" gutterBottom>Minhas Inscrições</Typography>
        <Divider sx={{ mb: 2 }} />

        {isFetching && (
          <Box sx={{ display:'flex', justifyContent:'center', py:4 }}>
            <CircularProgress/>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb:2 }}>
            Não foi possível carregar suas inscrições.
          </Alert>
        )}

        {(appsResp?.data ?? []).map((app: Application) => {
          const fd   = app.form_data;
          const pos  = fd.position;
          console.log(appsResp);
          const edit = () => navigate(`/applications/create/${app.process_selection_id}`);

          return (
            <Accordion key={app.id} sx={{ mb:1, borderRadius:2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item><SchoolIcon fontSize="small"/></Grid>
                  <Grid item xs>
                    <Typography>{pos.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fd.edital}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton size="small" onClick={edit}>
                      <EditIcon fontSize="small"/>
                    </IconButton>
                  </Grid>
                </Grid>
              </AccordionSummary>

              <AccordionDetails>
                <Typography variant="body2" gutterBottom>
                  <strong>Enviada em:</strong>{' '}
                  {new Date(app.created_at!).toLocaleDateString('pt-BR')}
                </Typography>
                <Typography variant="body2">
                  <strong>Campus:</strong> {pos.academic_unit.description}<br/>
                  <strong>Modalidades:</strong>{' '}
                  {fd.admission_categories.map(c => c.name).join(', ')}<br/>
                  <strong>Bônus:</strong> {fd.bonus ? fd.bonus.name : 'Nenhum'}<br/>
                  <strong>Inscrição ENEM:</strong> {fd.enem} / {fd.enem_year}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* Dialog – placeholder de edição de perfil */}
      <EditProfileDialog
        open={editDlg}
        onClose={() => setEditDlg(false)}
        onSave={() => { setEditDlg(false); setSnackOpen(true); }}
      />

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
      >
        <Alert severity="success" variant="filled" sx={{ width:'100%' }}>
          Dados atualizados!
        </Alert>
      </Snackbar>
    </Box>
  );
};

/* ------------ diálogo de edição de perfil (placeholder) ------------- */
interface EditDlgProps { open:boolean; onClose:()=>void; onSave:()=>void; }
const EditProfileDialog = ({ open, onClose, onSave }: EditDlgProps) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Editar Perfil</DialogTitle>
    <DialogContent dividers>
      <TextField label="Nome" fullWidth sx={{ mb:2 }} disabled />
      <TextField label="E-mail" fullWidth disabled />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="contained" onClick={onSave}>Salvar</Button>
    </DialogActions>
  </Dialog>
);

export { CandidateDashboard };
