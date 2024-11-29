import { useState, useCallback } from 'react';

export const useApplications = () => {
    const [applications, setApplications] = useState([]);

    const fetchApplications = useCallback(async () => {
        try {
            const response = await fetch('/api/applications');
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    }, []);

    return { applications, fetchApplications };
};
