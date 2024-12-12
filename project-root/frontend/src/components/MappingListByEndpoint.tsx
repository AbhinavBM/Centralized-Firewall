import React from 'react';
import { Mapping } from '../interfaces';

interface MappingListProps {
  mappings: Mapping[];
  onDeleteMapping: (id: string) => void;
}

const MappingList = ({ mappings, onDeleteMapping }: MappingListProps) => {
  const groupByEndpoint = mappings.reduce((groups, mapping) => {
    if (!groups[mapping.endpoint_id]) {
      groups[mapping.endpoint_id] = [];
    }
    groups[mapping.endpoint_id].push(mapping);
    return groups;
  }, {} as Record<string, Mapping[]>);

  return (
    <div>
      {Object.keys(groupByEndpoint).map((endpointId) => (
        <div key={endpointId}>
          <h4>Endpoint: {endpointId}</h4>
          <ul>
            {groupByEndpoint[endpointId].map((mapping) => (
              <li key={mapping.id}>
                <p>Application: {mapping.application_id}</p>
                <button onClick={() => onDeleteMapping(mapping.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MappingList;