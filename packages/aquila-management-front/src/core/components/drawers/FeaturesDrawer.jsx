import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import PropTypes from 'prop-types';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import modules from '../../../modules';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
}));

export default function FeaturesDrawer(props) {
    const { openTheDrawer, isOpen } = props;
    console.log(openTheDrawer);
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(openTheDrawer);
    const coreDrawerList = [
        {
            name: 'Server Data',
            path: '/dashboard/serverdata',
        },
        // { name: 'Server Notes', path: '/dashboard/servernotes' },
    ];

    const handleDrawerClose = () => {
        setOpen(false);
        isOpen(false);
    };

    // const [currentPage, setCurrentPage] = useState('Home');
    // const changeLocation = (elmt) => {
    //     setCurrentPage(elmt.name);
    // };

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            <List>
                {coreDrawerList.map((elmt) => (
                    <ListItem
                        button
                        key={elmt.name}
                        component={RouterLink}
                        to={elmt.path}
                        // onClick={() => changeLocation(elmt)}
                    >
                        <ListItemText primary={elmt.name} />
                    </ListItem>
                ))}
                <hr />
                {modules.map((module) => (
                    <ListItem
                        button
                        key={module.name}
                        component={RouterLink}
                        to={module.routeProps.path}
                        // onClick={() => changeLocation(module)}
                    >
                        <ListItemText primary={module.name} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

FeaturesDrawer.propTypes = {
    isOpen: PropTypes.func.isRequired,
    openTheDrawer: PropTypes.bool.isRequired,
};
