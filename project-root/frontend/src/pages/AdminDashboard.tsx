import React, { useState } from 'react';
import EndpointForm from '../components/EndpointForm';
import EndpointTable from '../components/EndpointTable';

const AdminDashboard: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCardClick = (tab: string) => {
        setSelectedTab(tab);
        setIsExpanded(true);
    };

    const handleBackClick = () => {
        setIsExpanded(false);
        setSelectedTab(null);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Admin Dashboard</h1>

            {isExpanded ? (
                // When a card is selected, show the corresponding component in full
                <>
                    
                    {selectedTab === 'register' && (
                        <>
                            <EndpointForm />
                        </>
                    )}
                    {selectedTab === 'list' && (
                        <>
                            <EndpointTable />
                        </>
                    )}
                    <button onClick={handleBackClick} style={styles.backButton}>
                        Back
                    </button>
                </>
            ) : (
                // When no card is selected, show two cards side by side
                <div style={styles.cardsContainer}>
                    <div style={styles.card} onClick={() => handleCardClick('register')}>
                        <h3 style={styles.cardHeading}>Register New Endpoint</h3>
                        <p style={styles.cardDescription}>Create new endpoints easily.</p>
                    </div>
                    <div style={styles.card} onClick={() => handleCardClick('list')}>
                        <h3 style={styles.cardHeading}>Endpoints List</h3>
                        <p style={styles.cardDescription}>View all registered endpoints.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        width: '80%',
        margin: '0 auto',
        maxWidth: '1200px',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '2.2rem',
        color: '#333',
        fontWeight: '600',
    },
    subheading: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '1.6rem',
        color: '#444',
        fontWeight: '500',
    },
    cardsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '30px',
    },
    card: {
        backgroundColor: '#f4f4f9',
        border: '1px solid #ddd',
        padding: '20px',
        width: '48%',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        marginBottom: '20px',
    },
    cardHeading: {
        fontSize: '1.8rem',
        color: '#333',
        fontWeight: '500',
    },
    cardDescription: {
        fontSize: '1.1rem',
        color: '#666',
        marginTop: '10px',
    },
    backButton: {
        display: 'block',
        margin: '20px auto',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background-color 0.3s',
    },
};

export default AdminDashboard;
