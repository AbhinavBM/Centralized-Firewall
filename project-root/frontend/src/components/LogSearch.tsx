import React, { useState } from 'react';

interface LogSearchProps {
  onSearch: (query: string) => void;
}

const LogSearch: React.FC<LogSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search logs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default LogSearch;
