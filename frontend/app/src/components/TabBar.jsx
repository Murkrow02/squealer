import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import {NavLink} from "react-router-dom";


export default function FixedBottomNavigation() {
    const [value, setValue] = React.useState(0);
    const ref = React.useRef(null);

    return (
        <Box sx={{ pb: 7 }} ref={ref}>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        console.log(newValue);
                    }}
                >
                    <BottomNavigationAction id="app-tab-1" label="Recents" to="/app" icon={<RestoreIcon />} />
                    <BottomNavigationAction id="app-tab-2"  label="Favorites" to="/smm" icon={<FavoriteIcon />} />
                    <BottomNavigationAction id="app-tab-3"  label="Archive" to="/pila" icon={<ArchiveIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}
