import React, { useEffect, useState } from 'react';
import Axios from 'axios';

export default function SampleModuleComponent1() {
    const [data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const parseUrl = process.env.REACT_APP_API_URL + 'api/sample/route1';
            const result = await Axios.get(parseUrl);
            setData(result.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <p>Sample Module Component 1 : {data}</p>
        </>
    );
}
