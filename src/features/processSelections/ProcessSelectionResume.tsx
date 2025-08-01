// src/features/processSelections/ProcessSelectionResume.tsx
import { Box, Typography, Grid, Card, CardContent, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ProcessSelection } from "../../types/ProcessSelection";
import { useGetProcessSelectionsQuery } from "./processSelectionSlice";
import { useGetDocumentsByProcessSelectionQuery } from "../documents/documentSlice";

export const ProcessSelectionResume = () => {
  const { data, isFetching, error } = useGetProcessSelectionsQuery({});
  const navigate = useNavigate();

  if (isFetching) return <Typography>Carregando...</Typography>;

  if (error) {
    return (
      <Box sx={{ mt: 4, mb: 4 }}>
        <>Erro de conexão com o servidor…</>
      </Box>
    );
  }

  const activeSelections =
    data?.data.filter((s) => s.status === "active") || [];
  const finishedSelections =
    data?.data.filter((s) => s.status === "finished") || [];

  return (
    <Box>
      <ProcessSelectionList
        title="🔵 Processos Ativos"
        selections={activeSelections}
        bgColor="grey.200"
      />
      <ProcessSelectionList
        title="✅ Finalizados"
        selections={finishedSelections}
        bgColor="grey.300"
      />
    </Box>
  );
};

/* ---------- List Section ---------- */
const ProcessSelectionList = ({
  title,
  selections,
  bgColor,
}: {
  title: string;
  selections: ProcessSelection[];
  bgColor: string;
}) => {
  if (selections.length === 0) return null;

  return (
    <Box sx={{ mt: 4, p: 4, bgcolor: bgColor, borderRadius: 2 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold" }}
        color="text.primary"
      >
        {title}
      </Typography>

      <Grid container spacing={3}>
        {selections.map((selection) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={selection.id}>
            <ProcessSelectionCard selection={selection} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

/* ---------- Card ---------- */
const ProcessSelectionCard = ({ selection }: { selection: ProcessSelection }) => {
  const { data: documentsData } = useGetDocumentsByProcessSelectionQuery({ processSelectionId: selection.id!, });
  const navigate = useNavigate();
  const maxNameLength = 30;
  const maxDescriptionLength = 60;

  const truncate = (txt: string, len: number) =>
    txt.length > len ? `${txt.substring(0, len)}…` : txt;

  return (
    <Card
      sx={{
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        "&:hover": { transform: "scale(1.03)", bgcolor: "action.hover" },
      }}
      onClick={() => navigate(`/process-selections/details/${selection.id}`)}
    >
      <CardContent>
        <Tooltip
          title={selection.name.length > maxNameLength ? selection.name : ""}
          arrow
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="text.primary"
            sx={{
              height: 28,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {truncate(selection.name, maxNameLength)}
          </Typography>
        </Tooltip>

        <Tooltip
          title={
            selection.description.length > maxDescriptionLength
              ? selection.description
              : ""
          }
          arrow
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              height: 42,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {truncate(selection.description, maxDescriptionLength)}
          </Typography>
        </Tooltip>

        {/* cursos e documentos */}
        <Typography
          variant="subtitle2"
          sx={{ mt: 2, fontWeight: "bold" }}
          color="text.primary"
        >
          📚 {selection.courses?.length || 0} Cursos
        </Typography>
        <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
          📄 {(() => {
            const numberDocs = documentsData?.data.filter(doc => doc.status !== 'draft').length || 0;
            return `${numberDocs} ${numberDocs === 1 ? 'Documento' : 'Documentos'}`;
          })() }
        </Typography>
      </CardContent>
    </Card>
  );
};
