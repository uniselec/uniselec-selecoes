import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSendLogOutMutation } from '../features/auth/authApiSlice';
import { Box, Button, IconButton, Toolbar, MenuItem, ListItemIcon } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from '@mui/icons-material/Logout';
import Logout from '@mui/icons-material/Logout';
import { useAppDispatch } from '../app/hooks';
import { logOut } from '../features/auth/authSlice';

export const LogoutItemMenu = () => {
    const dispatch  = useAppDispatch();
    const navigate = useNavigate();
    const [logout, statusLogout] = useSendLogOutMutation();
    const { enqueueSnackbar } = useSnackbar();


    const handleLogout = () => {
        logout({});
        dispatch(logOut());
    }

    useEffect(() => {
        if (statusLogout.isSuccess) {
            enqueueSnackbar("Logout realizado", { variant: "success" });
            navigate("/login");
        }
        if (statusLogout.error) {
            enqueueSnackbar("Falha no logout", { variant: "error" });
        }
    }, [enqueueSnackbar, statusLogout.error, statusLogout.isSuccess]);


    return (
        <MenuItem onClick={handleLogout}>
            <ListItemIcon>
                <Logout fontSize="small" />
            </ListItemIcon>
            Logout
        </MenuItem>
    )
}