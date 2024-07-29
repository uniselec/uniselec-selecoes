import { Box, Typography } from "@mui/material";
import {
  useGetApplicationsQuery,
} from "./applicationSlice";
import { Paper } from "@mui/material";
import { GridFilterModel } from "@mui/x-data-grid";
import { useState } from "react";
import { ApplicationTable } from "./components/ApplicationTable";
interface PaginationModel {
  pageSize: number;
  page: number;
}

export const ApplicationList = () => {
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 10,
    rowsPerPage: [10, 20, 30],
  });
  const { data, isFetching, error } = useGetApplicationsQuery(options);



  if (error) {
    return <Typography>Error fetching applications</Typography>;
  }

  return (
    <Box >
      <Paper sx={{ mt: 4, p: 5, mb: 4 }}>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Minha Inscrição</Typography>

          </Box>
          <ApplicationTable
            applications={data}
            isFetching={isFetching}
            paginationModel={{
              pageSize: 25,
              page: 0,
            }}

          />
        </Box>

      </Paper>

    </Box>
  );
};