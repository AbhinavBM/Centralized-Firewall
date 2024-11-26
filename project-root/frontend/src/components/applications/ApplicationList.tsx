import React, { useEffect, useState } from 'react';
import { getApplications } from '../../api/endpoints/applicationApi';
import { Application } from '../../interfaces/application';

const ApplicationList = () => {
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const fetchApplications = async () => {
            const fetchedApplications = await getApplications();
            setApplications(fetchedApplications);
        };
        fetchApplications();
    }, []);

    return (
        <div>
            <h2>Application List</h2>
            <ul>
                {applications.map(application => (
                    <li key={application.id}>
                        {application.name} - {application.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ApplicationList;
