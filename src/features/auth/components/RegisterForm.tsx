import { Box, Button, FormControl, Grid, Typography, TextField, Avatar, FormControlLabel, Checkbox, Divider } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from "react-router-dom";
import { useState, ChangeEvent } from 'react';
import { Credentials } from '../authApiSlice';
import { User } from "../../../types/User";

type Props = {
  credentials: User;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const RegisterForm = ({
  credentials,
  isdisabled = false,
  isLoading = false,
  handleSubmit,
  handleChange
}: Props) => {
  const [errorEmail, setErrorEmail] = useState({ valid: true, text: "" });
  const [errorConfirmEmail, setErrorConfirmEmail] = useState({ valid: true, text: "" });
  const [errorPassword, setErrorPassword] = useState({ valid: true, text: "" });
  const [errorConfirmPassword, setErrorConfirmPassword] = useState({ valid: true, text: "" });
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateEmail = () => {
    if (email !== confirmEmail) {
      setErrorConfirmEmail({ valid: false, text: "Os e-mails não coincidem" });
    } else {
      setErrorConfirmEmail({ valid: true, text: "" });
    }
  };

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setErrorConfirmPassword({ valid: false, text: "As senhas não coincidem" });
    } else {
      setErrorConfirmPassword({ valid: true, text: "" });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e);
  };

  return (
    <Box
      sx={{
        marginTop: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 2,
        maxWidth: 600,
        mx: 'auto'
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">Registro</Typography>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          validateEmail();
          validatePassword();
          if (errorConfirmEmail.valid && errorConfirmPassword.valid) {
            handleSubmit(event);
          }
        }}
      >
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Nome Completo"
                name="name"
                autoComplete="name"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="cpf"
                label="CPF"
                name="cpf"
                autoComplete="cpf"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                onChange={(e) => {
                  handleInputChange(e);
                  setEmail(e.target.value);
                }}
                onBlur={validateEmail}
                error={!errorEmail.valid}
                helperText={errorEmail.text}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="confirmEmail"
                label="Confirmar Email"
                name="confirmEmail"
                autoComplete="confirm-email"
                onChange={(e) => {
                  handleInputChange(e);
                  setConfirmEmail(e.target.value);
                }}
                onBlur={validateEmail}
                error={!errorConfirmEmail.valid}
                helperText={errorConfirmEmail.text}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(e) => {
                  handleInputChange(e);
                  setPassword(e.target.value);
                }}
                onBlur={validatePassword}
                error={!errorPassword.valid}
                helperText={errorPassword.text}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirmar Senha"
                type="password"
                id="confirmPassword"
                autoComplete="confirm-password"
                onChange={(e) => {
                  handleInputChange(e);
                  setConfirmPassword(e.target.value);
                }}
                onBlur={validatePassword}
                error={!errorConfirmPassword.valid}
                helperText={errorConfirmPassword.text}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrar
            </Button>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to="/login"
              sx={{ mb: 2 }}
            >
              Fazer Login
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};
