import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";

/** Types **/
export type Application = {
  id: string;
  courseName: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
  details: string;
};

export type Candidate = {
  name: string;
  email: string;
  phone: string;
  document: string;
};

/** Mock data **/
const mockCandidate: Candidate = {
  name: "João da Silva",
  email: "joao.silva@example.com",
  phone: "(11) 99999‑8888",
  document: "123.456.789‑00",
};

const mockApps: Application[] = [
  {
    id: "APP‑001",
    courseName: "Medicina",
    status: "Pending",
    submittedAt: "2025‑04‑01",
    details:
      "Inscrição para Medicina turno integral. Modalidade ampla concorrência.",
  },
  {
    id: "APP‑002",
    courseName: "Engenharia de Software",
    status: "Approved",
    submittedAt: "2025‑03‑15",
    details:
      "Inscrição aprovada para Engenharia de Software turno noturno.",
  },
  {
    id: "APP‑003",
    courseName: "Direito",
    status: "Rejected",
    submittedAt: "2025‑02‑10",
    details: "Inscrição recusada por documentação incompleta.",
  },
];

const statusColor = (status: Application["status"]) => {
  switch (status) {
    case "Approved":
      return "success";
    case "Rejected":
      return "error";
    default:
      return "warning";
  }
};

/** New visual – accordion master‑detail **/
const CandidateDashboard: React.FC = () => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [candidate, setCandidate] = useState<Candidate>(mockCandidate);
  const [apps] = useState<Application[]>(mockApps);
  const [editOpen, setEditOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleSave = (c: Candidate) => {
    setCandidate(c);
    setEditOpen(false);
    setSnackOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Portal do Candidato</Typography>
          <Button color="inherit" startIcon={<LogoutIcon />}>Sair</Button>
        </Toolbar>
      </AppBar>

      {/* Candidate summary */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 56, height: 56 }}>
                {candidate.name.split(" ")[0][0]}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h6" gutterBottom>
                {candidate.name}
              </Typography>
              <Typography>{candidate.email}</Typography>
              <Typography variant="body2" color="text.secondary">
                {candidate.phone} · {candidate.document}
              </Typography>
            </Grid>
            {/* <Grid item>
              <IconButton onClick={() => setEditOpen(true)}>
                <EditIcon />
              </IconButton>
            </Grid> */}
          </Grid>
        </Paper>

        {/* Applications accordion */}
        <Typography variant="h6" gutterBottom>
          Minhas Inscrições
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {apps
          .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt))
          .map((app) => (
            <Accordion key={app.id} sx={{ mb: 1, borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <SchoolIcon fontSize="small" />
                  </Grid>
                  <Grid item xs>
                    <Typography>{app.courseName}</Typography>
                    {isSmUp && (
                      <Typography variant="caption" color="text.secondary">
                        Enviado em {new Date(app.submittedAt).toLocaleDateString("pt-BR")}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item>
                    <Chip label={app.status} size="small" color={statusColor(app.status)} />
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" gutterBottom>
                  <strong>Data de envio:</strong> {new Date(app.submittedAt).toLocaleDateString("pt-BR")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {app.details}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
      </Box>

      {/* Edit dialog */}
      <EditProfileDialog
        open={editOpen}
        candidate={candidate}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />

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

/** Edit dialog **/
interface EditProfileDialogProps {
  open: boolean;
  candidate: Candidate;
  onClose: () => void;
  onSave: (c: Candidate) => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  candidate,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<Candidate>(candidate);

  const handleChange = (field: keyof Candidate) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => onSave(form);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Perfil</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nome"
              fullWidth
              value={form.name}
              onChange={handleChange("name")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="E‑mail"
              fullWidth
              value={form.email}
              onChange={handleChange("email")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Telefone"
              fullWidth
              value={form.phone}
              onChange={handleChange("phone")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Documento"
              fullWidth
              value={form.document}
              onChange={handleChange("document")}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { CandidateDashboard };
