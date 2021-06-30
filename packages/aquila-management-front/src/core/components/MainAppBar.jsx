import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

// import { Typography } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

import FeaturesDrawer from './drawers/FeaturesDrawer';
import ServerDataPage from './serverData/ServerDataPage';

import modules from '../../modules';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

export default function MainAppBar() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    // const [currentPage, setCurrentPage] = useState('Home');
    // const changeLocation = (elmt) => {
    //     setCurrentPage(elmt.name);
    // };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* <Typography>{currentPage}</Typography> */}
                </Toolbar>
            </AppBar>
            {open ? (
                <FeaturesDrawer
                    openTheDrawer={open}
                    isOpen={(openedDrawer) => setOpen(openedDrawer)}
                ></FeaturesDrawer>
            ) : (
                ''
            )}
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <Switch>
                    <Route exact path="/dashboard/serverdata" component={ServerDataPage} />
                    {/* TODO : The server notes page */}
                    {/* <Route exact path="/dashboard/servernotes" component={ServerDataPage} /> */}
                    {modules.map((module) => (
                        <Route {...module.routeProps} key={module.name} />
                    ))}
                </Switch>
            </main>
        </div>
    );
}
