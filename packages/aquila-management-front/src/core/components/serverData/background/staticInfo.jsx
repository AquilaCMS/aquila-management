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

let serverProbeUrl;

const useStyles = makeStyles({
    table: {
        minWidth: 250,
    },
});

async function getServerInfo() {
    let data = [];
    try {
        const result = await Axios.get(serverProbeUrl + '/static');
        data = result.data;
    } catch (err) {
        console.error(err);
    }
    return data;
}

export default function StaticServerInfo(props) {
    const { serverUrl } = props;
    serverProbeUrl = serverUrl + 'api/system';
    const [staticServerInfo, setStaticServerInfo] = useState([]);
    const [isLoading, loader] = useState(false);

    // Equivalent to componentDidMount and componentDidUpdate
    useEffect(() => {
        loader(true);
        const fetchData = async () => {
            setStaticServerInfo(await getServerInfo());
        };
        fetchData();
        loader(false);
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
                            <TableCell>OS</TableCell>
                            <TableCell>CPU</TableCell>
                            <TableCell>Memory</TableCell>
                            <TableCell>Swap Memory</TableCell>
                            <TableCell>File System</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staticServerInfo.map((elmt, i) => (
                            <TableRow key={i}>
                                <TableCell width="20%">
                                    {elmt.osInfo && elmt.osInfo.distro}
                                    {' ('}
                                    {elmt.osInfo && elmt.osInfo.arch}
                                    {')'}
                                    {'\n'}
                                    {elmt.osInfo && elmt.osInfo.release}
                                </TableCell>
                                <TableCell width="20%">
                                    {elmt.cpuInfo && elmt.cpuInfo.manufacturer}{' '}
                                    {elmt.cpuInfo && elmt.cpuInfo.brand}
                                </TableCell>
                                <TableCell width="10%">
                                    {elmt.memInfo && (elmt.memInfo.total / 1000000000).toFixed(3)}
                                    {' (GB)'}
                                </TableCell>
                                <TableCell width="15%">
                                    {elmt.memInfo &&
                                        (elmt.memInfo.swaptotal / 1000000000).toFixed(3)}
                                    {' (GB)'}
                                </TableCell>
                                <TableCell width="35%">
                                    {elmt.fsSize &&
                                        elmt.fsSize.map((elmt, i) => (
                                            <TableRow key={i}>
                                                {elmt.fs}
                                                {' (mount : '}
                                                {elmt.mount}
                                                {', size : '}
                                                {(elmt.size / 1000000000).toFixed(3)}
                                                {' (GB) )'}
                                            </TableRow>
                                        ))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

StaticServerInfo.propTypes = {
    serverUrl: PropTypes.string.isRequired,
};
