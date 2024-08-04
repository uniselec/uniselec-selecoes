import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { ResetPassword } from "../../types/ResetPassword";
import { useResetPasswordMutation } from "./authApiSlice";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export const PasswordReset = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [resetPassword, status] = useResetPasswordMutation();
  const navigate = useNavigate();
  const [isdisabled, setIsdisabled] = useState(false);
  const token = useParams().token as string;
  const email = useParams().email as string;
  const [resetPasswordState, setResetPasswordState] = useState<ResetPassword>({
    token, email
  } as ResetPassword);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await resetPassword(resetPasswordState);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetPasswordState({ ...resetPasswordState, [name]: value });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setResetPasswordState({ ...resetPasswordState, [name]: checked });
  };

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("ResetPassword created successfully", { variant: "success" });
      setIsdisabled(true);
      navigate('/login');
    }
    if (status.error) {
      enqueueSnackbar("ResetPassword not created", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create ResetPassword</Typography>
          </Box>
        </Box>
        <ResetPasswordForm
          isLoading={false}
          isdisabled={isdisabled}
          resetPassword={resetPasswordState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};