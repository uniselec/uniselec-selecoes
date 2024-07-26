import { Box, Typography } from "@mui/material";
import {
  useGetPatientsQuery,
} from "./patientSlice";

import { GridFilterModel } from "@mui/x-data-grid";
import { useState } from "react";
import { PatientTable } from "./components/PatientTable";
interface PaginationModel {
  pageSize: number;
  page: number;
}

export const PatientList = () => {
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 10,
    rowsPerPage: [10, 20, 30],
  });
  const { data, isFetching, error } = useGetPatientsQuery(options);

  function setPaginationModel(paginateModel:{ page: number, pageSize: number }){
    setOptions({ ...options, page: paginateModel.page + 1, perPage: paginateModel.pageSize});
  }
  function handleFilterChange(filterModel: GridFilterModel) {

    if (!filterModel.quickFilterValues?.length) {
      return setOptions({ ...options, search: "" });
    }
    const search = filterModel.quickFilterValues.join(" ");
    setOptions({ ...options, search });
  }

  if (error) {
    return <Typography>Error fetching patients</Typography>;
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>

      <PatientTable
        patients={data}
        isFetching={isFetching}
        paginationModel={{
          pageSize: 25,
          page: 0,
        }}
        handleSetPaginationModel={setPaginationModel}
        handleFilterChange={handleFilterChange}
      />
    </Box>
  );
};