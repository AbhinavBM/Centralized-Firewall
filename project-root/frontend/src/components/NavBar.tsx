import React from 'react';
import { Link } from 'react-router-dom';
import './styles/NavBar.css';

const NavBar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/applications">Applications</Link>
        </li>
        <li>
          <Link to="/mappings">Mappings</Link> {/* Added Mappings Link */}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
