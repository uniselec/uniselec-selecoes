import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "./userSlice";
import { User } from "../../types/User";
import { UserForm } from "./components/UserForm";

export const UserEdit = () => {
  const id = useParams().id as string;
  const { data: user, isFetching } = useGetUserQuery({ id });
  const [isdisabled, setIsdisabled] = useState(false);
  const [updateUser, status] = useUpdateUserMutation();
  const [userState, setUserState] = useState<User>({} as User);

  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await updateUser(userState);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserState({ ...userState, [name]: value });
  };


  useEffect(() => {
    if (user) {
      setUserState(user.data);
    }
  }, [user]);

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("User updated successfully", { variant: "success" });
      setIsdisabled(false);
    }
    if (status.error) {
      enqueueSnackbar("User not updated", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Editar Usuário</Typography>
          </Box>
        </Box>
        <UserForm
          isLoading={false}
          user={userState}
          isdisabled={isFetching || isdisabled}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};