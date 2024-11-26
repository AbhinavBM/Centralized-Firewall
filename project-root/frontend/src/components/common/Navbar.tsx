import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav>
        <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/endpoints">Endpoints</Link></li>
            <li><Link to="/applications">Applications</Link></li>
        </ul>
    </nav>
);

export default Navbar;
