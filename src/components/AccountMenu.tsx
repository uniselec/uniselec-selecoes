import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectAuthUser } from '../features/auth/authSlice';
import { LogoutItemMenu } from './LogoutItemMenu';
import TranslateIcon from '@mui/icons-material/Translate';
import { Button } from "@mui/material";
import { setLocale } from '../features/polyglot/polyglotSlice';
import { selectLocale } from "../features/polyglot/polyglotSlice";
type Lang  = {
    value: string;
    label: string;
}
const languages = [
    { value: "pt-BR", label: "Português" },
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" }
];


type Props = {
    toggleTheme: () => void;
    isDark?: boolean;
}
export function AccountMenu({ isDark, toggleTheme }: Props) {

    const locale = useAppSelector(selectLocale);
    const dispatch = useAppDispatch();
    const userAuth = useAppSelector(selectAuthUser);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const localeSelected: Lang | undefined = languages.find(language => language.value === locale);

    const [anchorElLanguage, setAnchorElLanguage] = React.useState<null | HTMLElement>(null);
    const openLanguage = Boolean(anchorElLanguage);

    const handleSelectLanguage = (lang: string) => {
        setAnchorElLanguage(null);
        dispatch(setLocale(lang));
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleClickLanguage = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElLanguage(event.currentTarget);
    };
    const handleCloseLanguage = () => {
        setAnchorElLanguage(null);
    };


    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>

                <Tooltip title="Sua Conta">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 1 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>{userAuth?.name?.substr(0, 1)}</Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MenuItem onClick={handleClose}>
                        <Avatar /> Perfil
                    </MenuItem>
                </Link>
                {/* <MenuItem onClick={handleClose}>
                    <Avatar /> My account
                </MenuItem> */}
                <Divider />
                <MenuItem onClick={handleClickLanguage} id="language-menu-button">
                    <ListItemIcon>
                        <TranslateIcon fontSize="small" />
                    </ListItemIcon>
                    Idioma: {localeSelected?.label}
                </MenuItem>
                {/* <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem> */}



                <MenuItem onClick={toggleTheme}>
                    <ListItemIcon>
                        {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
                    </ListItemIcon>
                    Mudar Tema
                </MenuItem>
                <Divider />

                {/* <MenuItem onClick={handleClose}>
                    Nível Admin
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    Nível Técnico
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    Nível Cliente
                </MenuItem> */}
                <LogoutItemMenu />
            </Menu>


            <div>

                <Menu
                    id="language-menu"
                    anchorEl={anchorElLanguage}
                    open={openLanguage}
                    onClose={handleCloseLanguage}
                    MenuListProps={{
                        'aria-labelledby': 'language-button',
                    }}
                >
                    <MenuItem onClick={() => {
                        handleSelectLanguage('pt-BR');
                    }}>Português (Brazil)</MenuItem>
                    <MenuItem onClick={() => {
                        handleSelectLanguage('en');
                    }}>English</MenuItem>
                    <MenuItem onClick={() => {
                        handleSelectLanguage('es');
                    }}>Espaõl</MenuItem>
                    <MenuItem onClick={() => {
                        handleSelectLanguage('fr');
                    }}>Français</MenuItem>

                </Menu>
            </div>
        </React.Fragment>
    );
}
