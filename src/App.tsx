import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./features/auth/Login";
import { AuthProfile } from "./features/auth/AuthProfile";
import { NotFoundCard } from "./components/NotFoundCard";
import { ApplicationList } from "./features/applications/ApplicationList";
import { ApplicationEdit } from "./features/applications/ApplicationEdit";
import { ApplicationCreate } from "./features/applications/ApplicationCreate";
import { UserList } from "./features/users/UserList";
import { UserEdit } from "./features/users/UserEdit";
import { Register } from "./features/auth/Register";




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
          <Route path="/" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />



          <Route path="/applications" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />
          <Route path="/applications/edit/:id" element={<ProtectedRoute><ApplicationEdit /></ProtectedRoute>} />
          <Route path="/applications/create" element={<ProtectedRoute><ApplicationCreate /></ProtectedRoute>} />


          <Route path="/profile" element={<ProtectedRoute><AuthProfile /></ProtectedRoute>} />




          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<NotFoundCard/>} />
        </Routes>
      </Layout>

    </Box>

  )
}

export default App;
