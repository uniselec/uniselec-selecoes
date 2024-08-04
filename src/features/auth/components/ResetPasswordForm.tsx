import {
    Box,
    Button,
    FormControl,
    Grid,
    TextField,
} from "@mui/material";

import { Link } from "react-router-dom";
import { ResetPassword } from "../../../types/ResetPassword";

type Props = {
    resetPassword: ResetPassword;
    isdisabled?: boolean;
    isLoading?: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ResetPasswordForm({
    resetPassword,
    isdisabled = false,
    isLoading = false,
    handleSubmit,
    handleChange
}: Props) {



    return (
        <Box p={2}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                required
                                name="password"
                                type="password"
                                label="Senha"
                                value={resetPassword.password || ""}
                                disabled={isdisabled}
                                onChange={handleChange}
                                inputProps={{ "data-testid": "password" }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                required
                                name="password_confirmation"
                                label="Confirmação da Senha"
                                type="password"
                                value={resetPassword.password_confirmation || ""}
                                disabled={isdisabled}
                                onChange={handleChange}
                                inputProps={{ "data-testid": "password" }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" gap={2}>
                            <Button variant="contained" component={Link} to="/">
                                Página Inicial
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                disabled={isdisabled || isLoading}
                            >
                                {isLoading ? "Loading..." : "Confirmar"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}