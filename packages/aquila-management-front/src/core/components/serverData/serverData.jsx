import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import StaticServerInfo from './background/staticInfo';
import DynamicServerInfo from './background/dynamicInfo';
import PortServerInfo from './background/portsInfo';
import DockerInfo from './applications/dockerInfo';
import Pm2Info from './applications/pm2Info';

import { makeStyles } from '@material-ui/core/styles';

import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RefreshIcon from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    radioButtonCheckedIcon: {
        color: theme.palette.success.main,
        marginRight: '10px',
    },
    radioButtonUncheckedIcon: {
        color: theme.palette.pending.main,
        marginRight: '10px',
    },
    buttonProgress: {
        color: theme.palette.primary.dark,
    },
    pending: {
        cursor: 'pointer',
    },
}));

export default function ServerData(props) {
    const { serverUrl } = props;
    const dockerUrl = serverUrl + 'api/docker';
    const pm2Url = serverUrl + 'api/pm2';

    const classes = useStyles();

    const [accordionInfo, setAccordionInfo] = useState([]);

    const [staticHello] = useState('found');
    const [dynamicHello] = useState('found');
    const [portHello] = useState('found');

    const [dockerHello, setDockerHello] = useState('pending');
    const [pm2Hello, setPm2Hello] = useState('pending');
    const [dockerVersion, setDockerVersion] = useState('');
    const [pm2Version, setPm2Version] = useState('');

    const stateTab = [staticHello, dynamicHello, portHello, dockerHello, pm2Hello];
    const versionTab = ['', '', '', dockerVersion, pm2Version];

    async function getDockerHello() {
        let data = '';
        try {
            const helloRes = await Axios.get(dockerUrl + '/hello');
            if (helloRes.data === 'Docker says hello') {
                const psRes = await Axios.get(dockerUrl + '/infos');
                if (psRes.data.length === 0) {
                    return 'CLI found but no active processes or the Docker daemon is not running';
                } else {
                    return 'found';
                }
            } else {
                return 'notFound';
            }
        } catch (err) {
            console.error(err);
        }
        return data;
    }
    async function getDockerVersion() {
        let dockerVersion = '';
        try {
            dockerVersion = await Axios.get(dockerUrl + '/version');
            dockerVersion = dockerVersion.data;
        } catch (err) {
            console.error(err);
        }
        return dockerVersion;
    }
    async function getPm2Hello() {
        let data = '';
        try {
            const result = await Axios.get(pm2Url + '/hello');
            data = result.data;
        } catch (err) {
            console.error(err);
        }
        return data;
    }
    async function getPm2Version() {
        let pm2Version = '';
        try {
            pm2Version = await Axios.get(pm2Url + '/version');
            pm2Version = pm2Version.data;
        } catch (err) {
            console.error(err);
        }
        return pm2Version.trim();
    }
    const fetchDocker = async () => {
        setDockerHello('pending');
        setDockerHello(await getDockerHello());
        setDockerVersion(await getDockerVersion());
    };
    const fetchPm2 = async () => {
        setPm2Hello((await getPm2Hello()) === 'PM2 says hello' ? 'found' : 'notFound');
        setPm2Version(await getPm2Version());
    };
    const updateAccordionInfo = async () => {
        await setAccordionInfo([
            {
                id: 'static',
                name: 'Static Server Informations',
                content: <StaticServerInfo serverUrl={serverUrl} />,
            },
            {
                id: 'dynamic',
                name: 'Dynamic Server Informations',
                content: <DynamicServerInfo serverUrl={serverUrl} />,
            },
            {
                id: 'port',
                name: 'Ports Informations',
                content: <PortServerInfo serverUrl={serverUrl} />,
            },
            {
                id: 'docker',
                name: 'Docker',
                content: <DockerInfo serverUrl={serverUrl} />,
                fetchFunction: fetchDocker,
            },
            {
                id: 'pm2',
                name: 'Pm2 Instances',
                content: <Pm2Info serverUrl={serverUrl} />,
                fetchFunction: fetchPm2,
            },
        ]);
    };
    useEffect(() => {
        fetchDocker();
        fetchPm2();
        updateAccordionInfo();
    }, []);

    return (
        <>
            {accordionInfo.map((elmt, i) =>
                stateTab[i] === 'found' ? (
                    <Accordion key={i}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={'panel' + i + 'a-content'}
                            id={'panel' + i + 'a-header'}
                        >
                            <Typography>
                                <Tooltip title="Found !">
                                    <RadioButtonCheckedIcon
                                        className={classes.radioButtonCheckedIcon}
                                    />
                                </Tooltip>
                            </Typography>
                            <Typography className={classes.heading}>
                                {elmt.name}
                                {versionTab[i] ? ` (${versionTab[i]})` : ''}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>{elmt.content}</AccordionDetails>
                    </Accordion>
                ) : (
                    <Accordion
                        key={i}
                        disabled={true}
                        onClick={stateTab[i] === 'pending' ? () => {} : elmt.fetchFunction}
                        className={classes.pending}
                    >
                        <AccordionSummary
                            expandIcon={
                                stateTab[i] === 'pending' ? (
                                    <CircularProgress
                                        size={30}
                                        className={classes.buttonProgress}
                                    />
                                ) : (
                                    <RefreshIcon disabled={false} />
                                )
                            }
                            aria-controls={'panel' + i + 'a-content'}
                            id={'panel' + i + 'a-header'}
                        >
                            <Typography>
                                <RadioButtonUncheckedIcon
                                    className={classes.radioButtonUncheckedIcon}
                                />
                            </Typography>
                            <Typography className={classes.heading}>
                                {elmt.name} ({stateTab[i]})
                            </Typography>
                        </AccordionSummary>
                    </Accordion>
                ),
            )}
        </>
    );
}

ServerData.propTypes = {
    serverUrl: PropTypes.string.isRequired,
};
