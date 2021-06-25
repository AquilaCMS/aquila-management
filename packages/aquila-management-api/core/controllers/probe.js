import { readFileSync } from 'fs';

const getProbesList = () => {
    try {
        const data = readFileSync('./data/serversList.json', 'utf8');
        const serversList = JSON.parse(data).serversList;
        return serversList;
    } catch (err) {
        console.error(err);
    }
};

export default {
    getProbesList,
};
