import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { AppBar, Tabs, Tab, Box } from '@material-ui/core';

import ServerData from './serverData';

const serversListUrl = process.env.REACT_APP_API_URL + 'api/probe';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            {...other}
        >
            {value === index && <Box m={1}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `wrapped-tab-${index}`,
        'aria-controls': `wrapped-tabpanel-${index}`,
    };
}

export default function ServerDataPage() {
    const [value, setValue] = useState('one');
    const [serversList, setServersList] = useState([]);
    const [isLoading, loader] = useState(false);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    async function getServersList(serversListUrl) {
        let data = [];
        try {
            const result = await axios.get(serversListUrl);
            data = result.data;
        } catch (err) {
            console.error(err);
        }
        return data;
    }
    useEffect(() => {
        loader(false);
        const fetchData = async () => {
            setServersList(await getServersList(serversListUrl));
        };
        fetchData();
        loader(false);
    }, []);
    return (
        <>
            {isLoading ? (
                'loading'
            ) : (
                <>
                    <AppBar position="static">
                        <Tabs value={value} onChange={handleChange} aria-label="Tabs">
                            {serversList.map((elmt, key) => (
                                <Tab
                                    key={key}
                                    value={key}
                                    label={elmt[0]}
                                    {...a11yProps({ key })}
                                />
                            ))}
                        </Tabs>
                    </AppBar>
                    {serversList.map((elmt, key) => (
                        <TabPanel key={key} value={value} index={key}>
                            <ServerData serverUrl={elmt[1]} />
                        </TabPanel>
                    ))}
                </>
            )}
        </>
    );
}
