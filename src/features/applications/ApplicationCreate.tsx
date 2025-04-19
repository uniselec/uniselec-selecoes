import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Application } from "../../types/Application";
import { useCreateApplicationMutation } from "./applicationSlice";
import { ApplicationForm } from "./components/ApplicationForm";
import { useNavigate, useParams } from "react-router-dom";
import { useGetApplicationsQuery, useUpdateApplicationMutation } from "./applicationSlice";
import { useGetProcessSelectionQuery } from "../processSelections/processSelectionSlice";
import { ProcessSelection } from "../../types/ProcessSelection";

export const ApplicationCreate = () => {
  const { id } = useParams();
  const { data: processSelection, isFetching: isFetchingProcess } = useGetProcessSelectionQuery({ id: id! });
  const [processSelectionState, setProcessSelectionState] = useState({} as ProcessSelection);

  const { enqueueSnackbar } = useSnackbar();
  const [createApplication, status] = useCreateApplicationMutation();
  const [updateApplication, statusUpdate] = useUpdateApplicationMutation();

  const [isdisabled, setIsdisabled] = useState(false);
  const [applicationState, setApplicationState] = useState<Application>({ data: {} } as Application);
  const navigate = useNavigate();
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 10,
    rowsPerPage: [10, 20, 30],
  });
  const { data, isFetching, error } = useGetApplicationsQuery(options);

  async function handleSubmit(applicationData: Application) {
    // Acrescenta o process_selection_id vindo do objeto processSelection
    const updatedData = {
      ...applicationData,
      process_selection_id: processSelectionState.id,
    };
    await createApplication(updatedData);
  }

  useEffect(() => {
    if (data?.data && Array.isArray(data.data) && data.data.length !== 0) {
      setApplicationState({ data: data.data[0].data } as Application);
    }
  }, [data]);

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Inscrição Realizada Com Sucesso", { variant: "success" });
      setIsdisabled(true);
      navigate('/applications');
    }
    if (status.error) {
      enqueueSnackbar("Application not created", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess, navigate]);

  useEffect(() => {
    if (processSelection) {
      setProcessSelectionState({ ...processSelection.data });
    }
  }, [processSelection]);

  if (processSelection === undefined || processSelection === null || isFetchingProcess) {
    return <>LOADING</>;
  }

  return (
    <Box>
      <Paper sx={{ p: 5 }}>
        <Box p={2}>
          <Box mb={2}>
            {(data?.data && Array.isArray(data.data) && data.data.length !== 0) ? (
              <Typography variant="h4">Alterar Inscrição</Typography>
            ) : (
              <Typography variant="h4">Realizar Inscrição</Typography>
            )}
            {/* Exibe o objeto processSelection para debug */}

          </Box>
        </Box>
        <ApplicationForm
          isLoading={false}
          isdisabled={isdisabled}
          application={applicationState}
          processSelection={processSelectionState}
          handleSubmit={(e, applicationData2) => {
            e.preventDefault();
            handleSubmit(applicationData2);
          }}
        />
      </Paper>
    </Box>
  );
};
