import {
  Card, CardContent, Typography, Box, Grid, Button
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { Application } from '../../../types/Application';
import { ProcessSelection } from '../../../types/ProcessSelection';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import EditIcon from '@mui/icons-material/Edit';
import Logo from "../../../assets/img/logo-unilab-preto.png";
import QRCode from "react-qr-code";


type Props = {
  application: Application;
  processSelection: ProcessSelection;
  onEdit: () => void;
};

export const ApplicationCard = ({
  application,
  processSelection,
  onEdit,
}: Props) => {
  const { form_data: fd } = application;

  /* 1️⃣  Referência para capturar apenas o card */
  const cardRef = useRef<HTMLDivElement | null>(null);

  /* 2️⃣  Geração do PDF */
  const generatePDF = async () => {
    if (!cardRef.current) return;

    // captura do card em alta resolução
    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // configura página A4 “retrato”
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // calcula altura proporcional
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

    // se overflow, cria páginas extras
    let position = 0;
    let remainingHeight = pdfHeight;
    while (remainingHeight > 0) {
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, pdfHeight);
      remainingHeight -= pageHeight;
      if (remainingHeight > 0) {
        position -= pageHeight;
        pdf.addPage();
      }
    }

    pdf.save(`comprovante-${application.id}.pdf`);
  };

  return (
    <>
      {/* 3️⃣  Envolve o conteúdo a ser exportado no ref */}
      <div ref={cardRef}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box
                  component="img"
                  sx={{
                    height: 64,
                    display: { xs: 'none', md: 'flex' },
                  }}
                  alt="Logo"
                  src={Logo}
                />
                <Typography variant="h5" align="center">
                  COMPROVANTE DE INSCRIÇÃO
                </Typography>
                <br />
                <Typography variant="subtitle1" align="center">
                  EDITAL PROGRAD Nº 12/2024, DE 31 DE JULHO DE 2024
                </Typography>
                <Typography variant="subtitle1" align="center">
                  PROCESSO SELETIVO UNILAB – (MODELO SISU) - INGRESSO NO PERÍODO
                  LETIVO 2024.1
                </Typography>
                <br />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Nome Completo:</strong> {fd.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Nome Social:</strong>{' '}
                      {fd.social_name || 'Não informado'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Data de Nascimento: </strong>
                      {fd.birthdate && isValid(parseISO(fd.birthdate))
                        ? format(parseISO(fd.birthdate), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })
                        : 'Data inválida'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong> {fd.email}
                    </Typography>
                    <Typography variant="body1">
                      <strong>CPF:</strong> {fd.cpf}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Sexo:</strong> {fd.sex}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Telefone 1:</strong> {fd.phone1}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Endereço:</strong> {fd.address}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Cidade-UF:</strong> {fd.city}-{fd.uf}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Edital:</strong> Edital nº 04/2024 - PROCESSO
                      SELETIVO UNILAB – PERÍODO LETIVO 2024.1 Curso Medicina
                    </Typography>
                    <Typography variant="body1">
                      <strong>Curso Pretendido:</strong> Medicina
                    </Typography>
                    <Typography variant="body1">
                      <strong>Local de Oferta:</strong> Baturité
                    </Typography>
                    <Typography variant="body1">
                      <strong>Número de Inscrição do ENEM:</strong> {fd.enem}
                    </Typography>
                  </Grid>
                </Grid>

                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Modalidades:</strong>{' '}
                  {fd.admission_categories.map((c: any) => c.name).join(', ')}
                </Typography>

                <Typography variant="body1">
                  <strong>Critérios de Bonificação:</strong>{' '}
                  {fd.bonus?.name || 'Nenhum'}
                </Typography>

                {
                  application.verification_code &&
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <QRCode value={`${window.location.origin}/verificar-comprovante/${application.verification_code}`} size={120} />
                  </Box>
                }

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Typography variant="body1">
                    <strong>Data da Inscrição: </strong>
                    {fd.updated_at && isValid(parseISO(fd.updated_at))
                      ? format(parseISO(fd.updated_at), 'dd/MM/yyyy HH:mm:ss', {
                        locale: ptBR,
                      })
                      : 'Data inválida'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Typography variant="body1">
                    <strong>Código de Verificação:</strong>{' '}
                    {application.verification_code} —{' '}
                    <strong>
                      {application.valid_verification_code
                        ? 'Válido'
                        : 'Inválido'}
                    </strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* 4️⃣  Botão de ação */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button
          startIcon={<PrintIcon />}
          variant="contained"
          color="primary"
          onClick={generatePDF}
        >
          Gerar PDF
        </Button>
        <Button
          startIcon={<EditIcon />}
          variant="contained"
          color="primary"
          onClick={onEdit}
        >
          Alterar Inscrição
        </Button>
      </Box>
    </>
  );
};
