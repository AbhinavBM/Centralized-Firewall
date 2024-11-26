import { useContext } from 'react';
import { EndpointContext } from '../context/EndpointContext';

export const useEndpoints = () => {
    const context = useContext(EndpointContext);
    if (!context) {
        throw new Error('useEndpoints must be used within an EndpointProvider');
    }
    return context;
};
