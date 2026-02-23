import { Box, Button, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Appeal } from "../../../types/Appeal";

type Props = {
  appeal: Appeal;
};

export function AppealReview({ appeal }: Props) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }} elevation={2}>
      <Typography sx={{ mt: 2 }}>
        {appeal?.decision || "Nenhum comentário disponível."}
      </Typography>

      <Typography sx={{ mt: 2, fontStyle: "italic" }} color="text.secondary">
        Status do recurso: {appeal?.status === "accepted" ? "Aceito" : "Rejeitado"}
      </Typography>
    </Paper>
  );
}
