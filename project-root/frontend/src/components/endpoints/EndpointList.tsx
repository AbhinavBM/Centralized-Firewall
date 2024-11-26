import React, { useEffect, useState } from 'react';
import { getEndpoints, deleteEndpoint } from '../../api/endpoints/endpointApi';
import { Endpoint } from '../../interfaces/endpoint';

const EndpointList = () => {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);

    useEffect(() => {
        const fetchEndpoints = async () => {
            const fetchedEndpoints = await getEndpoints();
            setEndpoints(fetchedEndpoints);
        };
        fetchEndpoints();
    }, []);

    const handleDelete = async (id: string) => {
        await deleteEndpoint(id);
        setEndpoints(endpoints.filter(endpoint => endpoint.id !== id));
    };

    return (
        <div>
            <h2>Endpoint List</h2>
            <ul>
                {endpoints.map(endpoint => (
                    <li key={endpoint.id}>
                        {endpoint.hostname} - {endpoint.status} 
                        <button onClick={() => handleDelete(endpoint.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EndpointList;
