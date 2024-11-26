import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApplicationDetails } from '../../api/endpoints/applicationApi';
import { Application } from '../../interfaces/application';

const ApplicationDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [application, setApplication] = useState<Application | null>(null);

    useEffect(() => {
        const fetchApplication = async () => {
            const applicationDetails = await getApplicationDetails(id);
            setApplication(applicationDetails);
        };
        fetchApplication();
    }, [id]);

    if (!application) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Application Detail</h2>
            <p>Name: {application.name}</p>
            <p>Status: {application.status}</p>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    );
};

export default ApplicationDetail;
