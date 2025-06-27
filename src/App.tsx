import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./features/auth/Login";
import { AuthProfile } from "./features/auth/AuthProfile";
import { NotFoundCard } from "./components/NotFoundCard";
import { PasswordReset } from "./features/auth/PasswordReset";
import { AuthProfileEdit } from "./features/auth/AuthProfileEdit";
import { useAppSelector } from "./app/hooks";
import { selectAuthUser } from "./features/auth/authSlice";
import { Register } from "./features/auth/Register";
import { CandidateDashboard } from "./features/applications/CandidateDashboard";
import { ProcessSelectionDetails } from "./features/processSelections/ProcessSelectionDetails";
import { ApplicationCreate } from "./features/applications/ApplicationCreate";
import { AboutSection } from "./components/AboutSelection";
import { InstitutionalSection } from "./components/InstitutionalSection";
import { HomePage } from "./components/HomePage";





function App() {
  const userAuth = useAppSelector(selectAuthUser);

  return (
    <Box
      component="main"
      sx={{
        height: "100vh",
        overflow: "auto"
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/process-selections/details/:id" element={<ProcessSelectionDetails />} />
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="/applications/create/:id" element={<ApplicationCreate />} />


          <Route path="/institucional" element={<InstitutionalSection />} />
          <Route path="/sobre" element={<AboutSection />} />
          <Route path="/home" element={<HomePage />} />



          <Route path="/profile" element={<ProtectedRoute><AuthProfile /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><AuthProfileEdit /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:token/:email" element={<PasswordReset />} />
          <Route path="*" element={<NotFoundCard/>} />
        </Routes>
      </Layout>

    </Box>

  )
}

export default App;
