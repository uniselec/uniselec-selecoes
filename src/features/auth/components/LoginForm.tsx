import {
    Alert,
    Box,
    Button,
    FormControl,
    Grid,
    Typography,
    TextField
} from "@mui/material";
import { useTheme } from "@mui/material";
import { useState, useEffect } from 'react';
import { Credentials } from '../authApiSlice';
import Logo3s from "../../../assets/img/logo-3s.png";
import Logo3sBlack from "../../../assets/img/logo-3s-black.png";
import styled from '@emotion/styled';




type Props = {
    credentials: Credentials;
    isdisabled?: boolean;
    isLoading?: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


export const LoginForm = ({
    credentials,
    isdisabled = false,
    isLoading = false,
    handleSubmit,
    handleChange
}: Props) => {


    const theme = useTheme();

    const [errorLogin, setErrorLogin] = useState({ valid: true, text: "" });
    const [errorPassword, setErrorPassowrd] = useState({ valid: true, text: "" });
    const isDarkMode = theme.palette.mode === 'dark';
    function validateLogin() {
        if (credentials.email.length > 1) {
            setErrorLogin({ valid: true, text: "" });
        } else {
            setErrorLogin({ valid: false, text: "Digite no mínimo 1 caractere" });
        }
    }

    function validatePassword() {
        if (credentials.password.length > 3) {
            setErrorPassowrd({ valid: true, text: "" });
        } else {
            setErrorPassowrd({ valid: false, text: "Digite no mínimo 3 caracteres" });
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            p={5}>
            <Box p={2} mb={2}>
                <Typography component="h1" variant="h5">Formulário de Login</Typography>
            </Box>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit(event);
                }}
            >

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            {errorLogin.valid ? (
                                ""
                            ) : (
                                <Alert severity="error">{errorLogin.text}</Alert>
                            )}
                            <TextField
                                required={true}
                                value={credentials.email}
                                onChange={handleChange}
                                name="email"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={isLoading}
                                error={!errorLogin.valid}
                                onBlur={validateLogin}
                                helperText={errorLogin.text}
                                label="E-mail"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                required={true}
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={isLoading}
                                error={!errorPassword.valid}
                                onBlur={validatePassword}
                                helperText={errorPassword.text}
                                label="Senha"
                                variant="outlined"
                                margin="normal"
                                type="password"
                                fullWidth
                                autoComplete="off"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" gap={2}>
                            <Button
                                disabled={!(errorPassword.valid && errorLogin.valid && !isLoading)}
                                type="submit"
                                variant="contained"
                            >
                                {isLoading ? "Aguarde..." : "Logar"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

            </form>
        </Box>
    )
}
