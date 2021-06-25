import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@material-ui/core';
import DockerActionsMenu from './dockerActionsMenu';
import ScriptsMenu from '../background/scriptsMenu';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

async function getServerData(dockerUrl) {
    let data = [];
    try {
        let result = await Axios.get(dockerUrl + '/infos');
        data = result.data;
    } catch (err) {
        console.error(err);
    }
    return data;
}

export default function DockerInfo(props) {
    const { serverUrl } = props;
    console.log('serverUrl');
    console.log(serverUrl);
    const dockerUrl = serverUrl + 'api/docker';
    const [dockerInfo, setDockerInfo] = useState([]);
    const [isLoading, loader] = useState(false);
    const classes = useStyles();
    const theme = useTheme();

    // Equivalent to componentDidMount and componentDidUpdate
    useEffect(() => {
        loader(true);
        const fetchData = async () => {
            setDockerInfo(await getServerData(dockerUrl));
        };
        fetchData();
        loader(false);
        let interval = setInterval(async () => fetchData(), 5000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Names</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Ports</TableCell>
                            <TableCell>
                                <DockerActionsMenu id="all" />
                            </TableCell>
                            <TableCell>
                                <ScriptsMenu name="all" type="Docker" serverUrl={serverUrl} />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dockerInfo &&
                            dockerInfo.map((elmt, i) => (
                                <TableRow
                                    key={i}
                                    style={
                                        elmt.Status.split(' ')[0] === 'Up'
                                            ? { backgroundColor: theme.palette.success.main }
                                            : elmt.Status.split(' ')[0] === 'Exited'
                                            ? { backgroundColor: theme.palette.error.main }
                                            : elmt.Status.split(' ')[
                                                  elmt.Status.split(' ').length
                                              ] === '(Paused)'
                                            ? { backgroundColor: theme.palette.warning.light }
                                            : elmt.Status === 'Created'
                                            ? { backgroundColor: theme.palette.error.light }
                                            : { backgroundColor: theme.palette.ntr.main }
                                    }
                                >
                                    <TableCell>{elmt.ID}</TableCell>
                                    <TableCell>{elmt.Image}</TableCell>
                                    <TableCell>{elmt.Created}</TableCell>
                                    <TableCell>{elmt.Status}</TableCell>
                                    <TableCell>{elmt.Names}</TableCell>
                                    <TableCell>{elmt.Size}</TableCell>
                                    <TableCell>{elmt.Ports ? elmt.Ports : '-'}</TableCell>
                                    <TableCell>
                                        <DockerActionsMenu id={elmt.ID} serverUrl={serverUrl} />
                                    </TableCell>
                                    <TableCell>
                                        <ScriptsMenu
                                            args={[elmt.name]}
                                            type="Docker"
                                            serverUrl={serverUrl}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

DockerInfo.propTypes = {
    serverUrl: PropTypes.string.isRequired,
};
