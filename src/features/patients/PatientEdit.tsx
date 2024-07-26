import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetPatientQuery,
  useUpdatePatientMutation,
} from "./patientSlice";
import { Patient } from "../../types/Patient";
import { PatientForm } from "./components/PatientForm";

export const PatientEdit = () => {
  const id = useParams().id as string;
  const { data: patient, isFetching } = useGetPatientQuery({ id });
  const [isdisabled, setIsdisabled] = useState(false);
  const [updatePatient, status] = useUpdatePatientMutation();
  const [patientState, setPatientState] = useState<Patient>({} as Patient);

  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await updatePatient(patientState);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientState({ ...patientState, [name]: value });
  };


  useEffect(() => {
    if (patient) {
      setPatientState(patient.data);
    }
  }, [patient]);

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Patient updated successfully", { variant: "success" });
      setIsdisabled(false);
    }
    if (status.error) {
      enqueueSnackbar("Patient not updated", { variant: "error" });
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
        <PatientForm
          isLoading={false}
          patient={patientState}
          isdisabled={isFetching || isdisabled}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};