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

import Pm2ActionsMenu from './pm2ActionsMenu';
import ScriptsMenu from '../background/scriptsMenu';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

async function getServerData(pm2Url) {
    let data = [];
    try {
        const result = await Axios.get(pm2Url + '/jlist');
        data = result.data;
    } catch (err) {
        console.error(err);
    }
    return data;
}

export default function Pm2Info(props) {
    const { serverUrl } = props;
    const pm2Url = serverUrl + 'api/pm2';
    const theme = useTheme();
    const [pm2jlist, setPm2jlist] = useState([]);
    const [isLoading, loader] = useState(false);

    useEffect(() => {
        loader(true);
        const fetchData = async () => {
            setPm2jlist(await getServerData(pm2Url));
        };
        fetchData();
        loader(false);
        let interval = setInterval(async () => fetchData(), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const total = (param) => {
        let tot = 0;
        pm2jlist.forEach((elmt) => (tot = tot + elmt.monit[param]));
        return tot;
    };

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
                            <TableCell>Name</TableCell>
                            <TableCell>App Version</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>CPU ({pm2jlist ? total('cpu').toFixed(1) : ''}%)</TableCell>
                            <TableCell>
                                RAM ({pm2jlist ? (total('memory') / 1000000).toFixed(1) : ''}MB)
                            </TableCell>
                            <TableCell>Heap Size (MiB)</TableCell>
                            <TableCell>Heap Usage (%)</TableCell>
                            <TableCell>Event Loop Lat. (ms)</TableCell>
                            <TableCell>
                                <Pm2ActionsMenu name="all" />
                            </TableCell>
                            <TableCell>
                                <ScriptsMenu args={['all']} type="Pm2" serverUrl={serverUrl} />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pm2jlist &&
                            pm2jlist.map((elmt, i) => (
                                <TableRow
                                    key={i}
                                    style={
                                        elmt.pm2_env && elmt.pm2_env.status === 'online'
                                            ? { backgroundColor: theme.palette.success.main }
                                            : elmt.pm2_env.status === 'stopping'
                                            ? { backgroundColor: theme.palette.pending.main }
                                            : elmt.pm2_env.status === 'stopped'
                                            ? { backgroundColor: theme.palette.warning.light }
                                            : elmt.pm2_env.status === 'launching'
                                            ? { backgroundColor: theme.palette.success.light }
                                            : elmt.pm2_env.status === 'errored'
                                            ? { backgroundColor: theme.palette.error.main }
                                            : { backgroundColor: theme.palette.ntr.main }
                                    }
                                >
                                    <TableCell>{elmt.name}</TableCell>
                                    <TableCell>
                                        {elmt.pm2_env ? elmt.pm2_env.version : ''}
                                    </TableCell>
                                    <TableCell>{elmt.pm2_env ? elmt.pm2_env.status : ''}</TableCell>
                                    <TableCell>{elmt.monit ? elmt.monit.cpu : ''}%</TableCell>
                                    <TableCell>
                                        {elmt.monit ? (elmt.monit.memory / 1000000).toFixed(3) : ''}{' '}
                                        MB
                                    </TableCell>
                                    <TableCell>
                                        {elmt.pm2_env && elmt.pm2_env.axm_monitor['Heap Size']
                                            ? elmt.pm2_env.axm_monitor['Heap Size'].value
                                            : ''}{' '}
                                        MiB
                                    </TableCell>
                                    <TableCell>
                                        {elmt.pm2_env && elmt.pm2_env.axm_monitor['Heap Usage']
                                            ? elmt.pm2_env.axm_monitor['Heap Usage'].value
                                            : ''}
                                        %
                                    </TableCell>
                                    <TableCell>
                                        {elmt.pm2_env &&
                                        elmt.pm2_env.axm_monitor['Event Loop Latency']
                                            ? elmt.pm2_env.axm_monitor['Event Loop Latency'].value
                                            : ''}{' '}
                                        ms
                                    </TableCell>
                                    <TableCell>
                                        <Pm2ActionsMenu name={elmt.name} serverUrl={serverUrl} />
                                    </TableCell>
                                    <TableCell>
                                        <ScriptsMenu
                                            args={[elmt.name]}
                                            type="Pm2"
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

Pm2Info.propTypes = {
    serverUrl: PropTypes.string.isRequired,
};
