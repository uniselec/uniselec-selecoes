import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRegisterMutation } from './authApiSlice';
import { RegisterForm } from './components/RegisterForm';
import { User } from "../../types/User";
import useTranslate from '../polyglot/useTranslate';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
interface UserForm {
    id?: number;
    name?: string;
    email?: string;
    confirmEmail?: string;
    cpf?: string;
    password?: string;
    confirmPassword?: string;
}
interface Credentials {
    name: string;
    email: string;
    cpf: string;
    password: string;
}
export const Register = () => {
    const translate = useTranslate('auth');
    const [register, statusLogin] = useRegisterMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const [credentials, setCredentials] = useState<User>({
        name: "",
        email: "",
        cpf: "",
        password: ""
    });

    const [credentialsForm, setCredentialsForm] = useState<UserForm>({
        name: "",
        email: "",
        confirmEmail: "",
        cpf: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCredentialsForm({ ...credentialsForm, [name]: value });
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        const { name = "", email = "", cpf = "", password = "" } = credentialsForm;
        const credentials: Credentials = { name, email, cpf, password };
        await register(credentials);
    }



    useEffect(() => {
        if (statusLogin.isSuccess) {
            enqueueSnackbar("Registro realizado com sucesso!", { variant: "success" });
            setIsLoading(false);

            if (location.pathname === '/register') {
                navigate('/candidate-dashboard');
            }
        }
        if (statusLogin.error) {
            if ('data' in statusLogin.error) {
                const errors = (statusLogin.error as { data: { error: { [key: string]: string[] } } }).data.error;
                if (errors) {
                    Object.entries(errors).forEach(([field, messages]) => {
                        if (Array.isArray(messages)) {
                            messages.forEach((message) => {
                                enqueueSnackbar(translate(message), { variant: "error" });
                            });
                        }
                    });
                }
            }

            setIsLoading(false);
        }
    }, [enqueueSnackbar, statusLogin.error, statusLogin.isSuccess, navigate, location.pathname]);



    return (
        <Box>
            <Paper sx={{ padding: 2, maxWidth: 600, mx: 'auto', marginTop: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Registro
                </Typography>
                <RegisterForm
                    credentials={credentialsForm}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </Paper>
        </Box>
    )
}
