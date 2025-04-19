import React, { useRef } from "react";
import { Typography, Box, List, ListItem, Button } from "@mui/material";
import { Results } from "../../../types/Application";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import LogoUNILAB from "../../../assets/img/logo-unilab-preto.png";
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PrintIcon from '@mui/icons-material/Print';

const ImageLogo = styled('img')`
  width: 300px;'
  padding: 30px;
  display: block;
  margin: 0 auto; // Centraliza a imagem
`;

type Props = {
  applications: Results | undefined;
  isFetching: boolean;
};

export function ApplicationTable({ applications, isFetching }: Props) {
  const pdfRef = useRef(null);

  const generatePDF = async () => {
    const input = pdfRef.current;
    if (input) {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let position = 0;
      let imgHeight = pdfHeight;
      if (imgHeight > pdf.internal.pageSize.getHeight()) {
        while (imgHeight > 0) {
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
          imgHeight -= pdf.internal.pageSize.getHeight();
          position -= pdf.internal.pageSize.getHeight();
          if (imgHeight > 0) {
            pdf.addPage();
          }
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save("comprovante_inscricao.pdf");
    }
  };

  if (isFetching) {
    return <Typography>Carregando inscrições...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {applications?.data.length === 0 ? (
        <Card sx={{ minWidth: "100%" }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Nenhuma inscrição encontrada
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <div>
          <Grid container spacing={3} ref={pdfRef}>
            {applications?.data?.map((value, key) => (
              <Grid item xs={12} md={12} lg={12} key={key}>
                <Card>
                  <CardContent>
                    <ImageLogo alt="Logo UNILAB" src={LogoUNILAB} />
                    <Typography variant="h5" align="center">
                      COMPROVANTE DE INSCRIÇÃO
                    </Typography><br />
                    <Typography variant="subtitle1" align="center">
                      EDITAL PROGRAD Nº 12/2024, DE 31 DE JULHO DE 2024
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      PROCESSO SELETIVO UNILAB – (MODELO SISU) - INGRESSO NO PERÍODO LETIVO 2024.1
                    </Typography><br />
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1"><strong>Nome Completo:</strong> {value.data.name}</Typography>
                        <Typography variant="body1"><strong>Nome Social:</strong> {value.data.social_name || "Não informado"}</Typography>
                        <Typography variant="body1">
                          <strong>Data de Nascimento: </strong>
                          {value.data.birtdate && isValid(parseISO(value.data.birtdate)) ?
                            format(parseISO(value.data.birtdate), 'dd/MM/yyyy', { locale: ptBR }) :
                            'Data inválida'}
                        </Typography>
                        <Typography variant="body1"><strong>Email:</strong> {value.data.email}</Typography>
                        <Typography variant="body1"><strong>CPF:</strong> {value.data.cpf}</Typography>
                        <Typography variant="body1"><strong>Sexo:</strong> {value.data.sex}</Typography>
                        <Typography variant="body1"><strong>Telefone 1:</strong> {value.data.phone1}</Typography>
                        <Typography variant="body1"><strong>Endereço:</strong> {value.data.address}</Typography>
                        <Typography variant="body1"><strong>Cidade-UF:</strong> {value.data.city}-{value.data.uf}</Typography>

                      </Grid>
                      <Grid item xs={12} md={6}>


                        <Typography variant="body1"><strong>Edital:</strong> Edital nº 04/2024 - PROCESSO SELETIVO UNILAB – PERÍODO LETIVO 2024.1 Curso Medicina</Typography>
                        <Typography variant="body1"><strong>Curso Pretendido:</strong> Medicina</Typography>
                        <Typography variant="body1"><strong>Local de Oferta:</strong> Baturité</Typography>
                        <Typography variant="body1"><strong>Número de Inscrição do ENEM:</strong> {value.data.enem}</Typography>
                      </Grid>
                    </Grid>
                    <Typography variant="body1"><strong>Modalidades:</strong></Typography>
                    {/* <List>
                      {value.data.vaga?.map((vaga, index) => (
                        <ListItem key={index}>
                          <Typography variant="body2">• {vaga}</Typography>
                        </ListItem>
                      ))}
                    </List> */}
                    <Typography variant="body1"><strong>Critérios de Bonificação:</strong></Typography>
                    {/* <List>
                      {value.data.bonus?.map((bonus, index) => (
                        <ListItem key={index}>
                          <Typography variant="body2">• {bonus}</Typography>
                        </ListItem>
                      ))}
                    </List> */}
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Typography variant="body1">
                        <strong>Data da Inscrição: </strong>
                        {value.data.updated_at && isValid(parseISO(value.data.updated_at)) ?
                          format(parseISO(value.data.updated_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }) :
                          'Data inválida'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Typography variant="body1"><strong>Código de Verificação:</strong> {value.verification_code}{" - "}<strong> {value.valid_verification_code ? "Válido" : "Inválido"}</strong></Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button startIcon={<PrintIcon />} variant="contained" color="primary" onClick={generatePDF}>
              Gerar PDF
            </Button>
          </Box>
        </div>
      )}
    </Box>
  );
}
