import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import { FormEvent, SyntheticEvent, useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Credentials } from '../authApiSlice';
import { Forgot } from "../../../types/ResetPassword";
import { IMaskInput } from 'react-imask';

type Props = {
    credentials: Credentials;
    isdisabled?: boolean;
    isLoading?: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmitFormForgot: (e: React.FormEvent<HTMLFormElement>, forgot: Forgot) => void;
};

// 1. Criamos o componente CPFMask que "embrulha" o IMaskInput
const CPFMask = forwardRef<any, any>(function CPFMask(props, ref) {
    const { onChange, name, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="000.000.000-00"
            definitions={{
                '0': /[0-9]/,
            }}
            inputRef={ref}
            // Quando o usuário digitar/perfurar a máscara,
            // chamamos onChange simulando um ChangeEvent<HTMLInputElement>
            onAccept={(value: any) => {
                onChange({
                    target: {
                        name: name,
                        value: value,
                    },
                } as React.ChangeEvent<HTMLInputElement>);
            }}
            overwrite
        />
    );
});

export const LoginForm = ({
    credentials,
    isdisabled = false,
    isLoading = false,
    handleSubmit,
    handleChange,
    handleSubmitFormForgot
}: Props) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [errorLogin, setErrorLogin] = useState({ valid: true, text: "" });
    const [errorPassword, setErrorPassowrd] = useState({ valid: true, text: "" });
    const isDarkMode = theme.palette.mode === 'dark';
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [forgotState, setForgotState] = useState({ identifier: "" } as Forgot);
    const handleChangeForgot = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForgotState({ ...forgotState, [name]: value });
    };
    const handleConfirmDialogClose = () => {
        setOpenConfirmDialog(false);
    };

    const handleConfirmSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        setOpenConfirmDialog(false);
        const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as FormEvent<HTMLFormElement>;
        handleSubmitFormForgot(formEvent, forgotState);
    };

    function validateLogin() {
        if (credentials.identifier.length > 1) {
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
                padding: 5,
            }}
            p={5}
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
                <Typography variant="subtitle1" color="textSecondary" mb={2}>
                    Entre com seu <b>CPF</b> e <b>Senha</b> para acessar sua conta.
                </Typography>
                <Grid container spacing={3}>
                    {/* === CAMPO CPF (com máscara) === */}
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            {!errorLogin.valid && (
                                <Alert severity="error">{errorLogin.text}</Alert>
                            )}
                            <TextField
                                required
                                name="identifier"
                                label="Digite o seu CPF"
                                value={credentials.identifier}
                                onChange={handleChange}
                                onBlur={validateLogin}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!errorLogin.valid}
                                helperText={errorLogin.text}
                                disabled={isLoading}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                // 2. Passamos o CPFMask via InputProps.inputComponent
                                InputProps={{
                                    inputComponent: CPFMask as any,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    {/* === CAMPO SENHA === */}
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                required
                                name="password"
                                label="Senha"
                                type="password"
                                value={credentials.password}
                                onChange={handleChange}
                                onBlur={validatePassword}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!errorPassword.valid}
                                helperText={errorPassword.text}
                                disabled={isLoading}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                autoComplete="off"
                            />
                        </FormControl>
                    </Grid>
                    {/* === BOTÕES DE ENVIO / RECUPERAR === */}
                    <Grid item xs={12}>
                        <Box display="flex" gap={2}>
                            <Button
                                disabled={!(errorPassword.valid && errorLogin.valid && !isLoading)}
                                type="submit"
                                variant="contained"
                            >
                                {isLoading ? "Aguarde..." : "Iniciar Sessão"}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/register')}
                            >
                                Cadastrar-se
                            </Button>
                            <Button
                                onClick={() => setOpenConfirmDialog(true)}
                                variant="outlined"
                            >
                                {isLoading ? "Aguarde..." : "Esqueceu a sua senha?"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>

            {/* === DIALOG PARA RECUPERAÇÃO DE SENHA === */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleConfirmDialogClose}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Recuperação da Senha</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Digite o CPF para recuperar sua senha:
                    </DialogContentText>
                    <Box mt={2}>
                        <FormControl fullWidth>
                            <TextField
                                required
                                name="identifier"
                                label="Seu CPF"
                                value={forgotState.identifier || ""}
                                onChange={handleChangeForgot}
                                disabled={isLoading}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                autoComplete="off"
                                // 3. Também aplicamos o CPFMask aqui dentro do diálogo
                                InputProps={{
                                    inputComponent: CPFMask as any,
                                }}
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirmSubmit}
                        color="secondary"
                        autoFocus
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
