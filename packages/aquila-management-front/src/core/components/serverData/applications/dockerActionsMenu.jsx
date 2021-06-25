import React, { useState } from 'react';
import Axios from 'axios';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';

import FullScreenLogs from '../../../../common/components/display/FullScreenLogs';

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

export default function DockerActionsMenu(props) {
    const { id, serverUrl } = props;
    const dockerUrl = serverUrl + 'api/docker';
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLogs, setIsLogs] = useState(false);
    const [logs, setLogs] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    async function postAction(id, action) {
        setSuccess(false);
        setLoading(true);
        setIsLogs(false);
        try {
            const res = await Axios.post(dockerUrl + '/actions', {
                action: action,
                id: id,
                responseType: 'json',
            });
            if (action === 'Logs') {
                setLogs(res.data);
                setIsLogs(true);
            } else {
                enqueueSnackbar(res.data, { variant: 'success' });
            }
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
                Actions
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <Button variant="contained" onClick={async () => postAction(id, 'Restart')}>
                        Restart
                    </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Button variant="contained" onClick={async () => postAction(id, 'Start')}>
                        Start
                    </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Button variant="contained" onClick={async () => postAction(id, 'Stop')}>
                        Stop
                    </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Button variant="contained" onClick={async () => postAction(id, 'Logs')}>
                        Logs
                    </Button>
                </MenuItem>
            </Menu>
            {isLogs ? <FullScreenLogs logs={logs} /> : ''}
            {loading && (
                <div className={classes.buttonProgressWrapper}>
                    <CircularProgress size={30} className={classes.buttonProgress} />
                </div>
            )}
        </>
    );
}

DockerActionsMenu.propTypes = {
    id: PropTypes.string.isRequired,
    serverUrl: PropTypes.string.isRequired,
};
