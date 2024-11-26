import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEndpointDetails } from '../../api/endpoints/endpointApi';
import { Endpoint } from '../../interfaces/endpoint';

const EndpointDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [endpoint, setEndpoint] = useState<Endpoint | null>(null);

    useEffect(() => {
        const fetchEndpoint = async () => {
            const endpointDetails = await getEndpointDetails(id);
            setEndpoint(endpointDetails);
        };
        fetchEndpoint();
    }, [id]);

    if (!endpoint) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Endpoint Detail</h2>
            <p>Hostname: {endpoint.hostname}</p>
            <p>IP Address: {endpoint.ip_address}</p>
            <p>Status: {endpoint.status}</p>
            <p>Last Sync: {endpoint.last_sync}</p>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    );
};

export default EndpointDetail;
