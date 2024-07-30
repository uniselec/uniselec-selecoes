import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetApplicationQuery,
  useUpdateApplicationMutation,
} from "./applicationSlice";
import { Application } from "../../types/Application";
import { ApplicationForm } from "./components/ApplicationForm";

export const ApplicationEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: application, isFetching } = useGetApplicationQuery({ id: id! });
  const [isdisabled, setIsdisabled] = useState(false);
  const [updateApplication, status] = useUpdateApplicationMutation();
  const [applicationState, setApplicationState] = useState<Application>({} as Application);

  const { enqueueSnackbar } = useSnackbar();


  async function handleSubmit(applicationData: Application) {
    if (id) {
      const applicationSub: Application = { ...applicationData, id };
      await updateApplication(applicationSub);
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent, checked?: boolean) => {
    const { name, value } = (e.target as HTMLInputElement);
    setApplicationState({ ...applicationState, data: { ...applicationState.data, [name]: value } });
  };

  useEffect(() => {
    if (application) {
      setApplicationState(application.data);
    }
  }, [application]);

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Application updated successfully", { variant: "success" });
      setIsdisabled(false);
    }
    if (status.error) {
      enqueueSnackbar("Application not updated", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box>
      <Paper sx={{ p: 5 }}>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Editar Inscrição</Typography>
          </Box>
        </Box>
        <ApplicationForm
          isLoading={isFetching}
          application={applicationState}
          isdisabled={isFetching || isdisabled}
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
