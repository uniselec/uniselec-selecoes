import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
} from "./organizationSlice";
import { Organization } from "../../types/Organization";
import { OrganizationForm } from "./components/OrganizationForm";

export const OrganizationEdit = () => {
  const id = useParams().id as string;
  const { data: organization, isFetching } = useGetOrganizationQuery({ id });
  const [isdisabled, setIsdisabled] = useState(false);
  const [updateOrganization, status] = useUpdateOrganizationMutation();
  const [organizationState, setOrganizationState] = useState<Organization>({} as Organization);

  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await updateOrganization(organizationState);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrganizationState({ ...organizationState, [name]: value });
  };


  useEffect(() => {
    if (organization) {
      setOrganizationState(organization.data);
    }
  }, [organization]);

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Organization updated successfully", { variant: "success" });
      setIsdisabled(false);
    }
    if (status.error) {
      enqueueSnackbar("Organization not updated", { variant: "error" });
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
        <OrganizationForm
          isLoading={false}
          organization={organizationState}
          isdisabled={isFetching || isdisabled}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};