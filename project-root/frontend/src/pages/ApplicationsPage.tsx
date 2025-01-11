import React, { useState } from 'react';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationList from '../components/ApplicationList';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background-color: #f0f8ff; /* Light blue background */
  padding: 20px;
  min-height: 100vh;
`;

const Card = styled.div`
  background-color: #ffffff; /* White card background */
  border: 2px solid #007bff; /* Blue border */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px;
  width: 300px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.h2`
  color: #007bff; /* Blue text */
  margin-bottom: 10px;
`;

const BackButton = styled.button`
  background-color: #ff4d4d; /* Red button background */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e60000; /* Darker red on hover */
  }
`;

const FullScreenContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
`;

const ApplicationsPage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  return (
    <PageContainer>
      {activeComponent === null && (
        <>
          <Card onClick={() => setActiveComponent('form')}>
            <Header>Create Application</Header>
          </Card>
          <Card onClick={() => setActiveComponent('list')}>
            <Header>Applications List</Header>
          </Card>
        </>
      )}
      {activeComponent === 'form' && (
        <FullScreenContainer>
          <BackButton onClick={() => setActiveComponent(null)}>Back</BackButton>
          <ApplicationForm />
        </FullScreenContainer>
      )}
      {activeComponent === 'list' && (
        <FullScreenContainer>
          <BackButton onClick={() => setActiveComponent(null)}>Back</BackButton>
          <ApplicationList />
        </FullScreenContainer>
      )}
    </PageContainer>
  );
};

export default ApplicationsPage;
