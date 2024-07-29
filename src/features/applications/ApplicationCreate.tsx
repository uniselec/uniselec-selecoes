import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Application } from "../../types/Application";
import { useCreateApplicationMutation } from "./applicationSlice";
import { ApplicationForm } from "./components/ApplicationForm";

export const ApplicationCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createApplication, status] = useCreateApplicationMutation();
  const [isdisabled, setIsdisabled] = useState(false);
  const [applicationState, setApplicationState] = useState<Application>({ data: {} } as Application);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await createApplication(applicationState);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent, checked?: boolean) => {
    const { name, value } = (e.target as HTMLInputElement);
    setApplicationState({ ...applicationState, data: { ...applicationState.data, [name]: value } });
  };

  const handleAutocompleteChange = (event: any, value: any, field: string) => {
    setApplicationState({ ...applicationState, data: { ...applicationState.data, [field]: value } });
  };

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Application created successfully", { variant: "success" });
      setIsdisabled(true);
    }
    if (status.error) {
      enqueueSnackbar("Application not created", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box>
      <Paper sx={{ p: 5 }}>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Realizar Inscrição</Typography>
          </Box>
        </Box>
        <ApplicationForm
          isLoading={false}
          isdisabled={isdisabled}
          application={applicationState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleAutocompleteChange={handleAutocompleteChange}
        />
      </Paper>
    </Box>
  );
};
