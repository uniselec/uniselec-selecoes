import { AppBar, Box, CssBaseline, ThemeProvider } from "@mui/material";
import { Container } from "@mui/system";
import { SnackbarProvider } from "notistack";
import React, { useState } from "react";
import { useAppTheme } from "../hooks/useAppTheme";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSlice";


const drawerWidth = 240;

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTheme, toggleCurrentTheme] = useAppTheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
        >
          <Header
            handleDrawerToggle={handleDrawerToggle}
            toggle={toggleCurrentTheme}
            isDark={currentTheme.palette.mode === "dark"}
            isAuth={isAuthenticated}
          />
        </AppBar>
        <SnackbarProvider
          autoHideDuration={2000}
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Container maxWidth={false} sx={{ color: "white", mt: 15, mb: 5 }}>
            {children}
          </Container>

        </SnackbarProvider>

      </Box>
      <Footer />
    </ThemeProvider>
  );
}