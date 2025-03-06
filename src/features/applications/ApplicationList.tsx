import { Box, Button, Typography } from "@mui/material";
import { useGetApplicationsQuery } from "./applicationSlice";
import { Paper } from "@mui/material";
import { useState } from "react";
import { ApplicationTable } from "./components/ApplicationTable";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { selectIsAuthenticated } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { useGetStudentSelectionQuery } from "../studentSelection/studentSelectionSlice";
interface PaginationModel {
  pageSize: number;
  page: number;
}

export const ApplicationList = () => {
const isAuthenticated = useSelector(selectIsAuthenticated);
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 10,
    rowsPerPage: [10, 20, 30],
  });

  const { data, isFetching, error } = useGetApplicationsQuery(options);
  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuthenticated) {
      navigate("/register");
    }

  }, [data, navigate]);

  if (error) {
    return <Typography>Error fetching applications</Typography>;
  }

  return (
    <Box>
      <Paper sx={{ p: 5 }}>
        <Box p={2}>
          <ApplicationTable applications={data} isFetching={isFetching} />
          <br></br><br></br>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            sx={{ mb: 2, mr: 2 }}
          >
            Página Inicial
          </Button>



          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/applications/create"
            sx={{ mb: 2 }}
          >
            {(data?.data && Array.isArray(data.data) && data.data.length === 0) ? "Realizar Inscrição":"Alterar Inscrição"}
          </Button>

        </Box>
      </Paper>
    </Box>
  );
};
