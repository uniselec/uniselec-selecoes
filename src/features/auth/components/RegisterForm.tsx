import {
    Alert,
    Box,
    Button,
    FormControl,
    Grid,
    Typography,
    Checkbox,
    TextField
} from "@mui/material";
import { useTheme } from "@mui/material";
import { useState, useEffect } from 'react';
import { Credentials } from '../authApiSlice';
import Logo3s from "../../../assets/img/logo-3s.png";
import Logo3sBlack from "../../../assets/img/logo-3s-black.png";
import styled from '@emotion/styled';
import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';


import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

type Props = {
    credentials: Credentials;
    isdisabled?: boolean;
    isLoading?: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


export const RegisterForm = ({
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
        <>
            <Box
                sx={{
                    marginTop: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box p={2} mb={2}>
                    <Typography component="h1" variant="h5">Formulário de Login</Typography>
                </Box>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit(event);
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        p={5}>

                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Registro
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>

                                    Already have an account? Sign in

                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </form>
            </Box>
        </>
    )
}
