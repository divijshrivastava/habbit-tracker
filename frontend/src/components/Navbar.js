import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1>Habit Tracker</h1>
      </Link>

      <nav>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <span style={{ color: '#666' }}>Hello, {user?.name}</span>
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register">
              <button className="btn btn-primary">Get Started</button>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
