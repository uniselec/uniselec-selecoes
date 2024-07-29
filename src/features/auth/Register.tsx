import {
    Box,
    Paper,
    Typography
} from "@mui/material";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Credentials, useLoginMutation, useSendLogOutMutation } from './authApiSlice';
import { RegisterForm } from './components/RegisterForm';


export const Register = () => {
    const [doLogin, statusLogin] = useLoginMutation();
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

    useEffect(() => {
        if (statusLogin.isSuccess) {
            enqueueSnackbar("Login Realizado com Sucesso!", { variant: "success" });
            setIsLoading(false);
            navigate('/login');
        }
        if (statusLogin.error) {
            enqueueSnackbar("Falha no Login", { variant: "error" });
            setIsLoading(false);
        }
    }, [enqueueSnackbar, statusLogin.error, statusLogin.isSuccess]);
    return (
        <Box>
            <Paper>
                <RegisterForm
                    credentials={credentials}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </Paper>
        </Box>
    )
}