import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";

export const SelectionProcess = () => {
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
          <List>
            <ListItem sx={{ backgroundColor: "#ffffff", borderRadius: 1, mb: 1, boxShadow: 1 }}>
              <ListItemButton component={Link} to="/selection-process/1" sx={{ "&:hover": { backgroundColor: "#bbdefb" } }}>
                <ListItemText
                  primary="Edital 04/2024 - PROCESSO SELETIVO UNILAB – PERÍODO LETIVO 2024.1 Curso Medicina"
                  primaryTypographyProps={{ color: "#0d47a1", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Box>
  );
};
