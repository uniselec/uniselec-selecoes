import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Organization } from "../../types/Organization";
import { useCreateOrganizationMutation } from "./organizationSlice";
import { OrganizationForm } from "./components/OrganizationForm";

export const OrganizationCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createOrganization, status] = useCreateOrganizationMutation();
  const [isdisabled, setIsdisabled] = useState(false);
  const [organizationState, setOrganizationState] = useState<Organization>({} as Organization);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await createOrganization(organizationState);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrganizationState({ ...organizationState, [name]: value });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOrganizationState({ ...organizationState, [name]: checked });
  };

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Organization created successfully", { variant: "success" });
      setIsdisabled(true);
    }
    if (status.error) {
      enqueueSnackbar("Organization not created", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create Organization</Typography>
          </Box>
        </Box>
        <OrganizationForm
          isLoading={false}
          isdisabled={isdisabled}
          organization={organizationState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};