import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    data: {
        marginLeft: theme.spacing(10),
        marginRight: theme.spacing(10),
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenLogs(props) {
    const { logs } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const parsingLogs = (logs) => {
        const logsTab = logs.split('\n');
        return logsTab;
    };

    useEffect(() => {
        setOpen(true);
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Logs
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Typography variant="body1" className={classes.data}>
                    {parsingLogs(logs).map((elmt, i) => (
                        <>
                            <br />
                            <span key={i}>{elmt}</span>
                        </>
                    ))}
                </Typography>
            </Dialog>
        </>
    );
}

FullScreenLogs.propTypes = {
    logs: PropTypes.string.isRequired,
};
