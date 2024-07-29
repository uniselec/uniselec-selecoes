import { Typography, Box, Button } from "@mui/material";
import React from "react";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridToolbar,
  ptBR,
} from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Results } from "../../../types/Application";
import { useDemoData } from '@mui/x-data-grid-generator';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import CreateIcon from '@mui/icons-material/Create';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

type Props = {
  applications: Results | undefined;
  isFetching: boolean;
};

export function ApplicationTable({
  applications,
  isFetching

}: Props) {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });




  // function renderNameCell(rowData: GridRenderCellParams) {
  //   return (
  //     <Link
  //       style={{ textDecoration: "none" }}
  //       to={`/applications/edit/${rowData.id}`}
  //     >
  //       <Typography color="primary">{rowData.value}</Typography>
  //     </Link>
  //   );
  // }


  const rowCount = applications?.meta.total || 0;

  return (
    <Box sx={{ display: "flex", height: 450, width: '100%' }}>


      {applications?.data.length === 0 ? (

        <>
          <React.Fragment>
            <Card sx={{ minWidth: "100%" }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Nenhuma inscrição Encontrada, clique aqui para realizar sua inscrição
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" component={Link} to="/applications/create">Realizar Inscrição</Button>
              </CardActions>
            </Card>
          </React.Fragment>


        </>) : (

        <>

          {applications?.data?.map((value, key) => (

            <React.Fragment key={key}>
              <Card sx={{ minWidth: "100%" }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {JSON.stringify(value)}
                  </Typography>
                  <Typography variant="h5" component="div">
                    Teste Coisas coais
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    adjective
                  </Typography>

                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" component={Link} to={`/applications/edit/${value?.id}`}>Alterar Inscrição</Button>
                </CardActions>
              </Card>
            </React.Fragment>

          ))}



        </>)
      }


    </Box >
  );
}