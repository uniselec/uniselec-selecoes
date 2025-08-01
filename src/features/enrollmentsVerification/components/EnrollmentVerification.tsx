import React from "react";
import { EnrollmentReceipt } from "./EnrollmentReceipt";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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

export const EnrollmentVerification: React.FC = () => {

  const [verificationCode, setVerificationCode] = React.useState<string>('');
  const [error, setError] = React.useState<{ enable: boolean, message: string }>({ enable: false, message: "" });
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (code) {
      setVerificationCode(code);
    }
  }, [code, location.state]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isEmptyInput(event.target.value);
    setVerificationCode(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEmptyInput(verificationCode)) {
      navigate(`/comprovante/${verificationCode}`);
    }
  };

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
      <Container maxWidth="sm" >
        {location.state?.errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            { location.state?.errorMessage }
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
            <Button
              color="primary"
              type="submit"
              variant="contained"
            >
              Verificar
            </Button>
        </Box>
      </Container>
    </>
  );
};