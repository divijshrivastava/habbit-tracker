import React, { useState, useEffect } from 'react';
import { habitsAPI, analyticsAPI } from '../services/api';
import HabitModal from '../components/HabitModal';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [habitsRes, statsRes] = await Promise.all([
        habitsAPI.getAll(),
        analyticsAPI.getOverview()
      ]);
      setHabits(habitsRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = () => {
    setSelectedHabit(null);
    setShowModal(true);
  };

  const handleEditHabit = (habit) => {
    setSelectedHabit(habit);
    setShowModal(true);
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
      await habitsAPI.delete(habitId);
      setSuccess('Habit deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete habit');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      await habitsAPI.complete(habitId, {
        date: new Date().toISOString().split('T')[0]
      });
      setSuccess('Habit completed!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || 'Failed to complete habit';
      setError(errorMsg);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSaveHabit = async (habitData) => {
    try {
      if (selectedHabit) {
        await habitsAPI.update(selectedHabit._id, habitData);
        setSuccess('Habit updated successfully');
      } else {
        await habitsAPI.create(habitData);
        setSuccess('Habit created successfully');
      }
      setShowModal(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save habit');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard container">
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Your Habit Dashboard</h1>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Habits</div>
            <div className="stat-number">{stats.totalHabits}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed Today</div>
            <div className="stat-number">{stats.completedToday}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Streaks</div>
            <div className="stat-number">{stats.activeStreaks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Success Rate</div>
            <div className="stat-number">{stats.todayCompletionRate}%</div>
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>My Habits</h2>
          <button className="btn btn-primary" onClick={handleCreateHabit}>
            + New Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No habits yet!</p>
            <p>Create your first habit to start tracking your progress.</p>
          </div>
        ) : (
          <div className="habits-grid">
            {habits.map((habit) => (
              <div key={habit._id} className="habit-card">
                <div className="habit-header">
                  <div>
                    <h3 className="habit-name">{habit.name}</h3>
                    {habit.description && (
                      <p className="habit-description">{habit.description}</p>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  <div>Frequency: <strong>{habit.frequency}</strong></div>
                  <div>Goal: <strong>{habit.goal} per day</strong></div>
                </div>

                <div className="streak-badge">
                  🔥 {habit.streak?.current || 0} day streak
                </div>
                {habit.streak?.longest > 0 && (
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                    Best: {habit.streak.longest} days
                  </div>
                )}

                <div className="habit-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleCompleteHabit(habit._id)}
                  >
                    ✓ Complete
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEditHabit(habit)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteHabit(habit._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <HabitModal
          habit={selectedHabit}
          onClose={() => setShowModal(false)}
          onSave={handleSaveHabit}
        />
      )}
    </div>
  );
}

export default Dashboard;
