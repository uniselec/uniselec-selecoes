import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ProcessSelectionResume } from "../features/processSelections/ProcessSelectionResume";

/**
 * Páginas do Portal Seleções (parte do sistema UniSelec)
 *
 * ▸ <HomePage />             → /
 * ▸ <AboutSection />         → /sobre
 * ▸ <InstitutionalSection /> → /institucional
 */

/* -------------------------------------------------------------------------- */
/* HomePage                                                                    */
/* -------------------------------------------------------------------------- */

export const HomePage: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 8 }}>
    {/* Título principal */}
    <Typography
      variant="h2"
      component="h1"
      align="center"
      sx={{ fontWeight: 700, mb: 2 }}
    >
      Portal Seleções
    </Typography>
    <Typography
      variant="h6"
      align="center"
      color="text.secondary"
      sx={{ mb: 6 }}
    >
      Parte do sistema <strong>UniSelec</strong>. Acompanhe e inscreva-se nos processos seletivos de
      graduação da UNILAB.
    </Typography>

    {/* Listagem de processos */}
    <ProcessSelectionResume />

    {/* Chama página de verificação do comprovante de inscrição */}
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Button
        component={RouterLink}
        to="/comprovante"
        variant="outlined"
        size="large"
        sx={{ borderRadius: 8, px: 4, py: 1.5 }}
      >
        Verificar comprovante de inscrição
      </Button>
    </Box>

    {/* Chamada secundária */}
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Button
        component={RouterLink}
        to="/sobre"
        variant="outlined"
        size="large"
        sx={{ borderRadius: 8, px: 4, py: 1.5 }}
      >
        Saiba mais sobre o UniSelec
      </Button>
    </Box>
  </Container>
);