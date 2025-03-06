import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./features/auth/Login";
import { AuthProfile } from "./features/auth/AuthProfile";
import { NotFoundCard } from "./components/NotFoundCard";
import { ApplicationList } from "./features/applications/ApplicationList";
import { ApplicationCreate } from "./features/applications/ApplicationCreate";
import { Register } from "./features/auth/Register";
import { SelectionProcessSelected } from "./features/applications/SelectionProcessSelected";
import { ProtectedRoutePeriod } from "./components/ProtectedRoutePeriod";
import { ProtectedRouteBeforeStart } from "./components/ProtectedRouteBeforeStart";
import { PasswordReset } from "./features/auth/PasswordReset";
import { ProcessSelectionList } from "./features/processSelections/ProcessSelectionList";
import { ProcessSelectionDetails } from "./features/processSelections/ProcessSelectionDetails";



function App() {

  return (
    <Box
      component="main"
      sx={{
        height: "100vh"
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<ProcessSelectionList />} />
          <Route path="/process-selections/details/:id" element={<ProcessSelectionDetails />} />
          <Route path="/applications" element={<ProtectedRoute><ProtectedRouteBeforeStart><ApplicationList /></ProtectedRouteBeforeStart></ProtectedRoute>} />
          <Route path="/applications/create" element={<ProtectedRoute><ApplicationCreate /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AuthProfile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<ProtectedRouteBeforeStart><Register /></ProtectedRouteBeforeStart>} />
          <Route path="/reset-password/:token/:email" element={<PasswordReset />} />
          <Route path="*" element={<NotFoundCard />} />
        </Routes>
      </Layout>

    </Box>

  )
}

export default App;
