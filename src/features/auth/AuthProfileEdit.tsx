// src/features/auth/AuthProfileEdit.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Paper,
  Autocomplete,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "./authSlice";
import { useSnackbar } from "notistack";
import { useUpdateProfileMutation } from "./authApiSlice";
import { User } from "../../types/User";

// Import de nuclei.json (mesmo esquema usado em UserForm)

type UserWithPasswordConf = Partial<User> & {
  password?: string;
  password_confirmation?: string;
};


// Situações funcionais
const functionalStatuses = [
  { value: "active", label: "ATIVO" },
  { value: "retired", label: "APOSENTADO" },
];

export function AuthProfileEdit() {
  const authUser = useAppSelector(selectAuthUser) as UserWithPasswordConf;
  const { enqueueSnackbar } = useSnackbar();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  if (!authUser || !authUser.id) {
    return (
      <Box p={2}>
        <Typography variant="h6" color="error">
          Usuário não autenticado.
        </Typography>
      </Box>
    );
  }

  // Estado inicial do formulário: clona authUser e adiciona campos de senha vazios
  const [userState, setUserState] = useState<UserWithPasswordConf>({
    ...authUser,
    password: "",
    password_confirmation: "",
  });

  // Atualiza form se authUser mudar
  useEffect(() => {
    setUserState({
      ...authUser,
      password: "",
      password_confirmation: "",
    });
  }, [authUser]);

  // Helper para campos de texto
  const handleField =
    (field: keyof UserWithPasswordConf) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserState((prev) => ({ ...prev, [field]: e.target.value }));
      };

  // Helper para datas



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: Record<string, any> = {};
    Object.entries(userState).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      // Envie password_confirmation somente se houver password
      if (key === "password_confirmation") {
        if (userState.password) payload[key] = value;
        return;
      }

      payload[key] = value;
    });

    try {
      await updateProfile(payload).unwrap();
      enqueueSnackbar("Perfil atualizado com sucesso!", { variant: "success" });
    } catch {
      enqueueSnackbar("Erro ao atualizar perfil.", { variant: "error" });
    }
  };


  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          p={5}
        >
          <Typography component="h1" variant="h5">
            Alterar Senha
          </Typography>
        </Box>
        <Box p={3} mb={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="mobile"
                  label="Celular"
                  value={userState.mobile || ""}
                  onChange={handleField("mobile")}
                  disabled={isLoading}
                />
              </Grid> */}
              {/* Telefone */}
              {/* <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Telefone"
                  value={userState.phone || ""}
                  onChange={handleField("phone")}
                  disabled={isLoading}
                />
              </Grid> */}
              {/* Password */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  value={userState.password || ""}
                  onChange={handleField("password")}
                  placeholder="Deixe vazio para manter a senha atual"
                  disabled={isLoading}
                />
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="password_confirmation"
                  label="Confirmar Senha"
                  type="password"
                  value={userState.password_confirmation || ""}
                  onChange={handleField("password_confirmation")}
                  placeholder="Confirme a nova senha"
                  disabled={isLoading}
                />
              </Grid>

              {/* Ações */}
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button variant="contained" href="/profile" disabled={isLoading}>
                    Voltar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Aguarde..." : "Salvar"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
