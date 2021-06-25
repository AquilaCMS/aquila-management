import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    buttonProgress: {
        position: 'relative',
        color: theme.palette.primary.dark,
        left: '100%',
        bottom: '33px',
    },
    buttonProgressWrapper: {
        position: 'absolute',
    },
}));

export default function ScriptsMenu(props) {
    const { args, type, serverUrl } = props;
    const serverScriptUrl = serverUrl + 'api/scripts';
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [scriptsList, setScriptsList] = useState([]);
    const [isLoading, loader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });

    // Equivalent to componentDidMount and componentDidUpdate
    useEffect(() => {
        loader(true);
        const fetchData = async () => {
            setScriptsList(await getScripts());
        };
        fetchData();
        loader(false);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    async function getScripts() {
        try {
            const result = await Axios.get(serverScriptUrl + '/', { params: { type: type } });
            return result.data;
        } catch (err) {
            console.error(err);
        }
    }
    async function postScript(fileName, args) {
        setSuccess(false);
        setLoading(true);
        try {
            const res = await Axios.post(serverScriptUrl + '/script', {
                fileName: fileName,
                args: args,
                responseType: 'json',
            });
            enqueueSnackbar(res.data, { variant: 'success' });
            setSuccess(true);
            setLoading(false);
            return res.data;
        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
            console.error(err);
        }
    }

    return (
        <>
            <Button
                variant="contained"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                disabled={loading}
                className={buttonClassname}
            >
                Scripts
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {scriptsList.length === 0 ? (
                    <MenuItem onClick={handleClose}>
                        <Button disabled={true}>{'No script found for this type'}</Button>
                    </MenuItem>
                ) : (
                    ''
                )}
                {scriptsList.map((elmt, i) => (
                    <MenuItem key={i} onClick={handleClose}>
                        {elmt.isActive === 'true' ? (
                            <Button
                                variant="contained"
                                onClick={async () => postScript(elmt.fileName, args)}
                            >
                                {elmt.scriptName}
                            </Button>
                        ) : (
                            <Button variant="contained" disabled={true}>
                                {elmt.scriptName}
                            </Button>
                        )}
                    </MenuItem>
                ))}
            </Menu>
            {loading && (
                <div className={classes.buttonProgressWrapper}>
                    <CircularProgress size={30} className={classes.buttonProgress} />
                </div>
            )}
        </>
    );
}

ScriptsMenu.propTypes = {
    args: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    serverUrl: PropTypes.string.isRequired,
};
