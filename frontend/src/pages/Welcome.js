import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div className="welcome">
      <h1>Welcome to Habit Tracker</h1>
      <p>Build better habits, track your progress, and achieve your goals</p>
      <div className="welcome-actions">
        <Link to="/login">
          <button className="btn btn-primary">Login</button>
        </Link>
        <Link to="/register">
          <button className="btn btn-secondary" style={{ background: 'white', color: '#667eea' }}>
            Get Started
          </button>
        </Link>
      </div>

      <div className="container" style={{ marginTop: '4rem' }}>
        <div className="stats-grid">
          <div className="card">
            <h3>📊 Track Progress</h3>
            <p style={{ color: '#666' }}>Monitor your daily habits and visualize your success rate over time</p>
          </div>
          <div className="card">
            <h3>🔥 Build Streaks</h3>
            <p style={{ color: '#666' }}>Stay motivated with streak tracking and completion analytics</p>
          </div>
          <div className="card">
            <h3>🎯 Set Goals</h3>
            <p style={{ color: '#666' }}>Define custom goals and get AI-powered projections for success</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
