import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Tabs from '@mui/material/Tabs';
import { useLocation } from 'react-router-dom';

import LinkTab from './LinkTab';


const tabs: Map<string, {label: string, to: string}> = new Map([
    ["/", {
        label: "Home",
        to: "/",
    }],
    ["/map", {
        label: "Map",
        to: "/map",
    }],
    ["/register", {
        label: "Register",
        to: "/register",
    }],
    ["/trade", {
        label: "Trade",
        to: "/trade",
    }],
])


function HeaderComponent() {
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setDrawerOpen(newOpen);
    };

    const DrawerContent = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <Tabs
                value={location.pathname}
                role="navigation"
                orientation="vertical"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                {Array.from(tabs, ([value, tab]) => (
                    <LinkTab label={tab.label} to={tab.to} value={value} key={value} />
                ))}
            </Tabs>
        </Box>
    )

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(!drawerOpen)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {
                                tabs.get(location.pathname)?.label || "Not Found"
                            }
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {DrawerContent}
            </Drawer>
        </>
    );
}

export default HeaderComponent;
