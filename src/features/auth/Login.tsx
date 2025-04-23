import {
    Alert,
    Box,
    Paper,
    Typography
} from "@mui/material";
import { useSnackbar } from 'notistack';
import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Credentials, useLoginMutation } from './authApiSlice';
import { LoginForm } from './components/LoginForm';
import { Forgot } from "../../types/ResetPassword";
import { usePasswordForgotMutation } from "./authApiSlice";

export const Login = () => {
    const [doLogin, statusLogin] = useLoginMutation();
    const [forgotPassword, statusForgotPassword] = usePasswordForgotMutation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [emailSended, setEmailSended] = useState("");
    const [credentials, setCredentials] = useState<Credentials>({
        email: "",
        password: "",
        device_name: "react_web"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        await doLogin(credentials);
    }
    async function handleSubmitFormForgot(e: React.FormEvent<HTMLFormElement>, forgotData: Forgot) {
        e.preventDefault();
        await forgotPassword(forgotData);
    }
    useEffect(() => {

        if (statusForgotPassword.isSuccess) {
            setEmailSended(statusForgotPassword?.data?.email)
            enqueueSnackbar(`Nós recebemos sua solicitação.`, { variant: "success" });
            setIsLoading(false);
        }
        if (statusForgotPassword.error) {
            enqueueSnackbar("Falha no tentativa de recuperação", { variant: "error" });
            setIsLoading(false);
        }
    }, [enqueueSnackbar, statusForgotPassword.error, statusForgotPassword.isSuccess]);
    useEffect(() => {
        if (statusLogin.isSuccess) {
            enqueueSnackbar("Login Realizado com Sucesso!", { variant: "success" });
            setIsLoading(false);
            navigate('/candidate-dashboard');
        }
        if (statusLogin.error) {
            enqueueSnackbar("Falha no Login", { variant: "error" });
            setIsLoading(false);
        }
    }, [enqueueSnackbar, statusLogin.error, statusLogin.isSuccess]);

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Paper>
                {emailSended != "" && emailSended != null ?
                    (
                        <Box display="flex" justifyContent="center">
                            <Alert severity="success">{`Enviamos um email para `}<strong>{emailSended}</strong></Alert>
                        </Box>
                    )
                    : (
                        <LoginForm
                            credentials={credentials}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            isLoading={isLoading}
                            handleSubmitFormForgot={handleSubmitFormForgot}
                        />
                    )}

            </Paper>
        </Box>
    )
}