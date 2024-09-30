import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Tabs from '@mui/material/Tabs';

import LinkTab from './LinkTab';


const tabs: Array<{label: string, to: string}> = [
    {
        label: "Home",
        to: "/",
    },
    {
        label: "Map",
        to: "/map",
    },
    {
        label: "Register",
        to: "/register",
    },
    {
        label: "Trade",
        to: "/trade",
    },
]


function HeaderComponent() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [tabValue, setTabValue] = React.useState(0);

    const toggleDrawer = (newOpen: boolean) => () => {
        setDrawerOpen(newOpen);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const DrawerContent = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                role="navigation"
                orientation="vertical"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                {tabs.map((tab) => (
                    <LinkTab label={tab.label} to={tab.to} />
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
                            {tabs[tabValue].label}
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
