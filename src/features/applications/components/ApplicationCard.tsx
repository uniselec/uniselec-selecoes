import {
  Card, CardContent, Typography, IconButton, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Application } from '../../../types/Application';
import { ProcessSelection } from '../../../types/ProcessSelection';

type Props = {
  application: Application;
  processSelection: ProcessSelection;
  onEdit: () => void;
};

export const ApplicationCard = ({ application, processSelection, onEdit }: Props) => {
  const { form_data: fd } = application;

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">
            Inscrição já existente neste processo
          </Typography>
          <IconButton onClick={onEdit} size="large" aria-label="Editar">
            <EditIcon />
          </IconButton>
        </Box>

        <Typography variant="subtitle2" sx={{ mt: 1 }}>{processSelection.name}</Typography>

        <Typography variant="body2" sx={{ mt: 2 }}>
          <strong>Curso:</strong> {fd.position.name}<br />
          <strong>Local:</strong> {fd.position.academic_unit.description}<br />
          <strong>Modalidades:</strong> {fd.admission_categories.map(c => c.name).join(', ')}<br />
          <strong>Bônus:</strong> {fd.bonus ? fd.bonus.name : 'Nenhum'}<br />
          <strong>Enem:</strong> {fd.enem} / {fd.enem_year}
        </Typography>
      </CardContent>
    </Card>
  );
};
