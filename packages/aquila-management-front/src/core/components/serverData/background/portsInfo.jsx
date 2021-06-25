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

async function getPortInfo() {
    let data = [];
    try {
        const result = await Axios.get(serverProbeUrl + '/');
        data = result.data;
    } catch (err) {
        console.error(err);
    }
    return data;
}

export default function PortServerInfo(props) {
    const { serverUrl } = props;
    serverProbeUrl = serverUrl + 'api/ports';
    const [staticServerInfo, setStaticServerInfo] = useState([]);
    const [isLoading, loader] = useState(false);

    // Equivalent to componentDidMount and componentDidUpdate
    useEffect(() => {
        loader(true);
        const fetchData = async () => {
            setStaticServerInfo(await getPortInfo());
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
                            <TableCell>Port</TableCell>
                            <TableCell>Process Path</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staticServerInfo.map((elmt, i) => (
                            <TableRow key={i}>
                                <TableCell width="20%">
                                    {elmt.port}
                                    {'\n'}
                                </TableCell>
                                <TableCell width="20%">
                                    {elmt.ps.path}
                                    {'\n'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

PortServerInfo.propTypes = {
    serverUrl: PropTypes.string.isRequired,
};
