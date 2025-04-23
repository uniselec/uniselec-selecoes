import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  Drawer,
  useMediaQuery,
  Container,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
  Avatar,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from "../assets/img/logo-unilab.png";
import { AccountMenu } from './AccountMenu';

interface MenuProps {
  handleDrawerToggle: () => void;
  toggle: () => void;
  isDark: boolean;
  isAuth: boolean;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const pages: any[] = [
  { name: 'Início', path: '/' },
  { name: 'Institucional', path: '/institucional' },
  { name: 'Sobre', path: '/sobre' },
  { name: 'Area do Candidato', path: '/candidate-dashboard' },
];

const LargeMenu: React.FC<{ handleCloseNavMenu: () => void }> = ({ handleCloseNavMenu }) => {
  const theme = useTheme();
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
      {pages.map((page) => (
        <Link key={page.name} to={page.path} style={{ textDecoration: 'none' }}>
          <Box
            onClick={handleCloseNavMenu}
            sx={{
              color: theme.palette.common.white,
              fontSize: 24,
              fontFamily: 'Fjalla One',
              fontWeight: 400,
              px: 2,
              cursor: 'pointer'
            }}
          >
            {page.name}
          </Box>
        </Link>
      ))}
    </Box>
  );
};

const SmallMenu: React.FC<{
  anchorElNav: null | HTMLElement;
  handleOpenNavMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseNavMenu: () => void;
}> = ({ anchorElNav, handleOpenNavMenu, handleCloseNavMenu }) => {
  const theme = useTheme();
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
      <IconButton
        size="large"
        aria-label="menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {pages.map((page) => (
          <MenuItem key={page.name} onClick={handleCloseNavMenu}>
            <Typography
              sx={{
                textAlign: 'center',
                color: theme.palette.text.primary,
              }}
            >
              <Link
                to={page.path}
                style={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                }}
              >
                {page.name}
              </Link>
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export const Header: React.FC<MenuProps> = ({
  handleDrawerToggle,
  toggle,
  isDark,
  isAuth,
  mobileOpen,
  setMobileOpen,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    setMobileOpen(!mobileOpen);
  };

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };




  return (
    <AppBar
      position="static"
      sx={{

        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl" sx={{ height: 80, mt: 2 }}>
        <Toolbar disableGutters>
          <Link to="/">
            <Box
              component="img"
              sx={{
                height: 64,
                display: { xs: 'none', md: 'flex' },
              }}
              alt="Logo"
              src={Logo}
            />
          </Link>
          <Link to="/">
            <Box
              component="img"
              sx={{
                height: 64,
                mr: 1,
                display: { xs: 'flex', md: 'none' },
              }}
              alt="Logo"
              src={Logo}
            />
          </Link>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: theme.palette.text.primary,
              textDecoration: 'none',
            }}
          />
          <LargeMenu handleCloseNavMenu={handleCloseNavMenu} />

            {isAuth && (
              <AccountMenu isDark={isDark} toggleTheme={toggle} />
            )}

          <SmallMenu
            anchorElNav={anchorElNav}
            handleOpenNavMenu={handleOpenNavMenu}
            handleCloseNavMenu={handleCloseNavMenu}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
