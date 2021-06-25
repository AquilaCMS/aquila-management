import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ScriptsMenu from './scriptsMenu';

const useStyles = makeStyles({
    table: {
        minWidth: 250,
    },
});

async function getServerInfo(serverProbeUrl) {
    let data = [];
    try {
        const result = await Axios.get(serverProbeUrl + '/dynamic');
        data = result.data;
    } catch (err) {
        console.error(err);
    }
    return data;
}

export default function DynamicServerInfo(props) {
    const { serverUrl } = props;
    const serverProbeUrl = serverUrl + 'api/system';
    const [dynamicServerInfo, setDynamicServerInfo] = useState([]);
    const [isLoading, loader] = useState(false);

    useEffect(() => {
        loader(true);
        const fetchData = async () => {
            setDynamicServerInfo(await getServerInfo(serverProbeUrl));
        };
        fetchData();
        loader(false);
        let interval = setInterval(async () => fetchData(), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const classes = useStyles();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>CPU</TableCell>
                            <TableCell>CPUS</TableCell>
                            <TableCell>Memory (used/free)</TableCell>
                            <TableCell>Swap Memory (used/free)</TableCell>
                            <TableCell>File System (used/free)</TableCell>
                            <TableCell>Scripts</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dynamicServerInfo.map((elmt, i) => (
                            <TableRow key={i}>
                                <TableCell width="20%">
                                    {'Average Load : '}
                                    {elmt.currentLoad.avgLoad
                                        ? elmt.currentLoad.avgLoad.toFixed(2)
                                        : ''}
                                    {'%'}
                                    <br />
                                    {'Current Load : '}
                                    {elmt.currentLoad.currentLoad
                                        ? elmt.currentLoad.currentLoad.toFixed(2)
                                        : ''}
                                    {'%'}
                                </TableCell>
                                <TableCell width="20%">
                                    {elmt.currentLoad &&
                                        elmt.currentLoad.cpus.map((elmt, i) => (
                                            <TableRow key={i}>
                                                {'CPU '}
                                                {i}
                                                {' : '}
                                                {elmt.load.toFixed(2)}
                                                {'%'}
                                            </TableRow>
                                        ))}
                                </TableCell>
                                <TableCell width="20%">
                                    {elmt.memInfo && (elmt.memInfo.used / 1000000000).toFixed(3)}
                                    {' (GB) / '}
                                    {elmt.memInfo && (elmt.memInfo.free / 1000000000).toFixed(3)}
                                    {' (GB)'}
                                </TableCell>
                                <TableCell width="20%">
                                    {elmt.memInfo &&
                                        (elmt.memInfo.swapused / 1000000000).toFixed(3)}
                                    {' (GB) / '}
                                    {elmt.memInfo &&
                                        (elmt.memInfo.swapfree / 1000000000).toFixed(3)}
                                    {' (GB)'}
                                </TableCell>
                                <TableCell width="35%">
                                    {elmt.fsSize &&
                                        elmt.fsSize.map((elmt, i) => (
                                            <TableRow key={i}>
                                                {(elmt.used / 1000000000).toFixed(3)}
                                                {' (GB) / '}
                                                {((elmt.size - elmt.used) / 1000000000).toFixed(3)}
                                                {' (GB)'}
                                            </TableRow>
                                        ))}
                                </TableCell>
                                <TableCell>
                                    <ScriptsMenu
                                        args={['all']}
                                        type="System"
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

DynamicServerInfo.propTypes = {
    serverUrl: PropTypes.string.isRequired,
};
