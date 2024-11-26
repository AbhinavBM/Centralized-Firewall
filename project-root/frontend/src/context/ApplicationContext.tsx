import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ApplicationContextType {
    applications: any[];
    fetchApplications: () => void;
    addApplication: (applicationData: any) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const useApplications = () => {
    const context = useContext(ApplicationContext);
    if (!context) {
        throw new Error('useApplications must be used within an ApplicationProvider');
    }
    return context;
};

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [applications, setApplications] = useState<any[]>([]);

    const fetchApplications = async () => {
        // Call API to fetch applications and update state
        setApplications(await getApplications());
    };

    const addApplication = async (applicationData: any) => {
        // Call API to add an application and update state
        const newApplication = await createApplication(applicationData);
        setApplications([...applications, newApplication]);
    };

    return (
        <ApplicationContext.Provider value={{ applications, fetchApplications, addApplication }}>
            {children}
        </ApplicationContext.Provider>
    );
};
