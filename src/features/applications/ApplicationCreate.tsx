import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { FormEvent, useEffect, useState } from "react";
import { Application } from "../../types/Application";
import { useCreateApplicationMutation } from "./applicationSlice";
import { ApplicationForm } from "./components/ApplicationForm";
import { useNavigate } from 'react-router-dom';

export const ApplicationCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createApplication, status] = useCreateApplicationMutation();
  const [isdisabled, setIsdisabled] = useState(false);
  const [applicationState, setApplicationState] = useState<Application>({ data: {} } as Application);
  const navigate = useNavigate();

  async function handleSubmit(applicationData:Application) {
    await createApplication(applicationData);
  }
  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Application created successfully", { variant: "success" });
      setIsdisabled(true);
      navigate('/applications');
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
          handleSubmit={
            (e: React.FormEvent<HTMLFormElement>, applicationData2: Application) => {
              handleSubmit(applicationData2);
            }
          }
        />
      </Paper>
    </Box>
  );
};
