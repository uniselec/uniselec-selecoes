import {
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
            enqueueSnackbar(`Nós enviamos um e-mail para email`, { variant: "success" });
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
            navigate('/applications');
        }
        if (statusLogin.error) {
            enqueueSnackbar("Falha no Login", { variant: "error" });
            setIsLoading(false);
        }
    }, [enqueueSnackbar, statusLogin.error, statusLogin.isSuccess]);

    useEffect(() => {
        if (statusLogin.isSuccess) {
            enqueueSnackbar("Login Realizado com Sucesso!", { variant: "success" });
            setIsLoading(false);
            navigate('/applications');
        }
        if (statusLogin.error) {
            enqueueSnackbar("Falha no Login", { variant: "error" });
            setIsLoading(false);
        }
    }, [enqueueSnackbar, statusLogin.error, statusLogin.isSuccess]);
    return (
        <Box>
            <Paper>
                <LoginForm
                    credentials={credentials}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    handleSubmitFormForgot={handleSubmitFormForgot}
                />
            </Paper>
        </Box>
    )
}