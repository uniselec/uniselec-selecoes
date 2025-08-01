import React from "react";
import { EnrollmentVerification as EnrollmentVerificationType } from "../../../types/EnrollmentVerification";
import { Link, useParams } from "react-router-dom";
import { useLazyVerifyEnrollmentQuery } from "../enrollmentVerificationSlice";
import {
  Container,
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AuthProfile } from "../../auth/AuthProfile";
import Logo from "../../../assets/img/logo-unilab-preto.png";
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const EnrollmentVerification: React.FC = () => {

  const [verificationCode, setVerificationCode] = React.useState<string>('');
  const [fetchEnrollment, { data, isFetching, isError, isSuccess }] = useLazyVerifyEnrollmentQuery();
  const [enrollmentDetails, setEnrollmentDetails] = React.useState<EnrollmentVerificationType | null>(null);
  const [error, setError] = React.useState<{ enable: boolean, message: string }>({ enable: false, message: "" });
  const { code } = useParams<{ code?: string }>();

  React.useEffect(() => {
    if (code) {
      setVerificationCode(code);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isEmptyInput(event.target.value);
    setVerificationCode(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEmptyInput(verificationCode)) {
      fetchEnrollment(verificationCode);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      setEnrollmentDetails(data?.data);
    }

    if (isError) {
      setEnrollmentDetails(null); 
    }
  }, [data, isSuccess, isError]);

  const handleClick = () => {
    setEnrollmentDetails(null);
  }

  const isEmptyInput = (input: string) => {
    if (input === "") {
      setError({ enable: true, message: "Este campo é obrigatório." });
      return true;
    } else {
      setError({ enable: false, message: "" });
      return false;
    }
  }

  return (  
    <>
      {isSuccess && enrollmentDetails ? 
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
            <Button variant="contained" onClick={handleClick}>
              Voltar
            </Button>
          </Box>
        </>
      :
        <Container maxWidth="sm" >
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Código de verificação inexistente na base dados.
            </Alert>
          )}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: "grey.100",
              borderRadius: 2,
              gap: 2,
              p: 4,
              boxShadow: 3
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 4 }}>Verificar Comprovante de Inscrição</Typography>
            <TextField
              error={error.enable}
              required
              fullWidth
              label="Digite o código de verificação"
              size="small"
              value={verificationCode}
              onChange={handleChange}
              onBlur={(event) => isEmptyInput(event.target.value)}
              helperText={error.message}
            />
            {isFetching ? <CircularProgress size={24} />
              : 
              <Button
                color="primary"
                type="submit"
                variant="contained"
              >
                Verificar
              </Button>
            }

          </Box>
        </Container>
      }
    </>
  );
};