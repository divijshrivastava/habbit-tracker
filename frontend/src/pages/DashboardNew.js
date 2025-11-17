import React, { useState, useEffect } from 'react';
import { habitsAPI, analyticsAPI } from '../services/api';
import HabitCalendar from '../components/HabitCalendar';
import HabitModal from '../components/HabitModal';

function DashboardNew() {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [viewMode, setViewMode] = useState('monthly');
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

  const today = new Date();
  const monthName = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="dashboard-new container">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="dashboard-header">
        <div className="header-left">
          <h1>Habit Tracker</h1>
          <div className="month-display">{monthName}</div>
        </div>
        <div className="header-right">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'weekly' ? 'active' : ''}`}
              onClick={() => setViewMode('weekly')}
            >
              Weekly
            </button>
            <button
              className={`toggle-btn ${viewMode === 'monthly' ? 'active' : ''}`}
              onClick={() => setViewMode('monthly')}
            >
              Monthly
            </button>
            <button
              className={`toggle-btn ${viewMode === 'yearly' ? 'active' : ''}`}
              onClick={() => setViewMode('yearly')}
            >
              Yearly
            </button>
          </div>
          <button className="btn btn-primary add-habit-btn" onClick={handleCreateHabit}>
            + Add Habit
          </button>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h2>No habits yet!</h2>
          <p>Create your first habit to start tracking your progress.</p>
          <button className="btn btn-primary" onClick={handleCreateHabit}>
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="habits-calendar-grid">
          {habits.map((habit) => (
            <div key={habit._id} className="habit-calendar-wrapper">
              <HabitCalendar habit={habit} viewMode={viewMode} />
              <div className="habit-actions-bottom">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleCompleteHabit(habit._id)}
                >
                  ✓ Complete Today
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleEditHabit(habit)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteHabit(habit._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default DashboardNew;
