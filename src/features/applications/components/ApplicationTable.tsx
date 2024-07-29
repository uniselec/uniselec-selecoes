import { Typography, Box } from "@mui/material";
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

type Props = {
  applications: Results | undefined;
  paginationModel: object;
  isFetching: boolean;
};

export function ApplicationTable({
  applications,
  paginationModel,
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
  console.log(applications);
  return (
    <Box sx={{ display: "flex", height: 450, width: '100%' }}>


      {/* {JSON.stringify(applications)} */}
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {[1, 2, 3].map((value) => (
          <ListItem
            key={value}
            disableGutters
            secondaryAction={
              <IconButton aria-label="comment">
                <CommentIcon />
              </IconButton>
            }
          >
            <ListItemText primary={`Line item ${value}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}