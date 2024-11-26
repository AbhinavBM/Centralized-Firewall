import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Endpoint } from '../interfaces/endpoint';
import { getEndpoints, createEndpoint, deleteEndpoint } from '../api/endpoints/endpointApi';

interface EndpointContextType {
    endpoints: Endpoint[];
    fetchEndpoints: () => Promise<void>;
    addEndpoint: (endpoint: Endpoint) => Promise<void>;
    removeEndpoint: (id: string) => Promise<void>;
}

const EndpointContext = createContext<EndpointContextType | undefined>(undefined);

export const EndpointProvider = ({ children }: { children: ReactNode }) => {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);

    const fetchEndpointsHandler = async () => {
        const fetchedEndpoints = await getEndpoints();
        setEndpoints(fetchedEndpoints);
    };

    const addEndpointHandler = async (endpoint: Endpoint) => {
        const newEndpoint = await createEndpoint(endpoint);
        setEndpoints([...endpoints, newEndpoint]);
    };

    const removeEndpointHandler = async (id: string) => {
        await deleteEndpoint(id);
        setEndpoints(endpoints.filter(endpoint => endpoint.id !== id));
    };

    return (
        <EndpointContext.Provider value={{ endpoints, fetchEndpoints: fetchEndpointsHandler, addEndpoint: addEndpointHandler, removeEndpoint: removeEndpointHandler }}>
            {children}
        </EndpointContext.Provider>
    );
};

export const useEndpoint = () => {
    const context = useContext(EndpointContext);
    if (!context) {
        throw new Error('useEndpoint must be used within an EndpointProvider');
    }
    return context;
};
