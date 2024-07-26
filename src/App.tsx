import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./features/auth/Login";
import { OrganizationCreate } from "./features/organizations/OrganizationCreate";
import { OrganizationEdit } from "./features/organizations/OrganizationEdit";
import { OrganizationList } from "./features/organizations/OrganizationList";
import { AuthProfile } from "./features/auth/AuthProfile";
import { NotFoundCard } from "./components/NotFoundCard";
import { PatientList } from "./features/patients/PatientList";
import { PatientEdit } from "./features/patients/PatientEdit";
import { PatientCreate } from "./features/patients/PatientCreate";
import { UserList } from "./features/users/UserList";
import { UserEdit } from "./features/users/UserEdit";




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
          <Route path="/" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />


          <Route path="/organizations" element={<ProtectedRoute><OrganizationList /></ProtectedRoute>} />
          <Route path="/organizations/edit/:id" element={<ProtectedRoute><OrganizationEdit /></ProtectedRoute>} />
          <Route path="/organizations/create" element={<ProtectedRoute><OrganizationCreate /></ProtectedRoute>} />

          <Route path="/patients" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
          <Route path="/patients/edit/:id" element={<ProtectedRoute><PatientEdit /></ProtectedRoute>} />
          <Route path="/patients/create" element={<ProtectedRoute><PatientCreate /></ProtectedRoute>} />


          <Route path="/profile" element={<ProtectedRoute><AuthProfile /></ProtectedRoute>} />




          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFoundCard/>} />
        </Routes>
      </Layout>

    </Box>

  )
}

export default App;
