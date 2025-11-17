import React, { useState, useEffect } from 'react';

function HabitModal({ habit, onClose, onSave }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [goal, setGoal] = useState(1);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || '');
      setFrequency(habit.frequency);
      setGoal(habit.goal);
    }
  }, [habit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, frequency, goal: Number(goal) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{habit ? 'Edit Habit' : 'Create New Habit'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Habit Name *</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Morning Exercise"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this habit involve?"
            />
          </div>

          <div className="form-group">
            <label>Frequency *</label>
            <select
              className="form-control"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="form-group">
            <label>Daily Goal *</label>
            <input
              type="number"
              className="form-control"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {habit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HabitModal;
