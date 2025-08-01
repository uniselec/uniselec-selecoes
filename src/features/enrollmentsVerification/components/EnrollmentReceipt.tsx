import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Box, Button, Typography, CircularProgress } from "@mui/material";
import Logo from "../../../assets/img/logo-unilab-preto.png";
import { useLazyVerifyEnrollmentQuery } from "../enrollmentVerificationSlice";
import { EnrollmentVerification as EnrollmentVerificationType } from "../../../types/EnrollmentVerification";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export const EnrollmentReceipt: React.FC = () => {

  const navigate = useNavigate();
  const [fetchEnrollment, { data, isFetching, isError, isSuccess }] = useLazyVerifyEnrollmentQuery();
  const [enrollmentDetails, setEnrollmentDetails] = React.useState<EnrollmentVerificationType | null>(null);
  const { code } = useParams<{ code?: string }>();

  React.useEffect(() => {
    fetchEnrollment(code);
  }, []);

  React.useEffect(() => {
    if (isSuccess) {
      setEnrollmentDetails(data?.data);
    }

    if (isError) {
      setEnrollmentDetails(null);
      navigate(`/verificar-comprovante/${code}`, {
        state: { errorMessage: "Código de verificação inválido ou não encontrado." }
      });
    }
  }, [data, isSuccess, isError]);
  
  return (
    <>
      {isFetching ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={48} />
        </Box>
      ) : (
        <>
          {(isSuccess && enrollmentDetails) &&
            <>
              <Box
                sx={{
                  bgcolor: "grey.100",
                  borderRadius: 2,
                  boxShadow: 3,
                  mb: 3,
                  p: 4,
                  flexGrow: 1,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box
                      component="img"
                      sx={{
                        height: 64,
                        display: { xs: 'none', md: 'flex' },
                      }}
                      alt="Logo"
                      src={Logo}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Box>
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
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1">
                        <strong>Nome Completo:</strong> {enrollmentDetails['name']}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Nome Social:</strong>{' '}
                        {enrollmentDetails['social_name'] || 'Não informado'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Data de Nascimento: </strong>
                        {enrollmentDetails['birthdate'] && isValid(parseISO(enrollmentDetails['birthdate']))
                          ? format(parseISO(enrollmentDetails['birthdate']), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })
                          : 'Data inválida'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Email:</strong> {enrollmentDetails['email']}
                      </Typography>
                      <Typography variant="body1">
                        <strong>CPF:</strong> {enrollmentDetails['cpf']}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Sexo:</strong> {enrollmentDetails['sex']}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Telefone 1:</strong> {enrollmentDetails['phone']}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Endereço:</strong> {enrollmentDetails['address']}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Cidade-UF:</strong> {enrollmentDetails['city']}-{enrollmentDetails['uf']}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Edital:</strong> Edital nº 04/2024 - PROCESSO
                        SELETIVO UNILAB – PERÍODO LETIVO 2024.1 Curso Medicina
                      </Typography>
                      <Typography variant="body2">
                        <strong>Curso Pretendido:</strong>{' '}
                        {enrollmentDetails['course']}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Local de Oferta:</strong>{' '}
                        {enrollmentDetails['academic_unit']}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Número de Inscrição do ENEM:</strong>{' '}
                        {enrollmentDetails['enem']}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1">
                        <strong>Modalidades:</strong>{' '}
                        {enrollmentDetails.admission_categories.join(', ')}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Critérios de Bonificação:</strong>{' '}
                        {enrollmentDetails['bonus'] || 'Nenhum'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="body1">
                        <strong>Data da Inscrição: </strong>
                        {enrollmentDetails['registration_date'] && isValid(parseISO(enrollmentDetails['registration_date']))
                          ? format(parseISO(enrollmentDetails['registration_date']), 'dd/MM/yyyy HH:mm:ss', {
                            locale: ptBR,
                          })
                          : 'Data inválida'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Código de Verificação:</strong>{' '}
                        {enrollmentDetails['verification_code']}
                      </Typography>
                    </Box>
                  </Grid>

                </Grid>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Button variant="contained" onClick={() => navigate(`/verificar-comprovante/${code}`)}>
                  Voltar
                </Button>
              </Box>
            </>
          }
        </>
      )}
    </>
  );
};