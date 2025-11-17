import React from 'react';

function HabitCalendar({ habit, viewMode = 'monthly' }) {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ empty: true, key: `empty-${i}` });
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);

      const isCompleted = habit.completions?.some(c => {
        const completionDate = new Date(c.date);
        completionDate.setHours(0, 0, 0, 0);
        return completionDate.getTime() === date.getTime();
      });

      const isToday = day === today.getDate();
      const isPast = date < today;

      days.push({
        day,
        isCompleted,
        isToday,
        isPast,
        key: `day-${day}`
      });
    }

    return days;
  };

  const calculateStats = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const daysPassed = today.getDate();

    const completionsThisMonth = habit.completions?.filter(c => {
      const date = new Date(c.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length || 0;

    const successRate = daysPassed > 0
      ? ((completionsThisMonth / daysPassed) * 100).toFixed(1)
      : 0;

    return {
      completionsThisMonth,
      successRate,
      streak: habit.streak?.current || 0
    };
  };

  const days = generateCalendarDays();
  const stats = calculateStats();

  return (
    <div className="habit-calendar-card">
      <div className="habit-calendar-header">
        <div className="habit-title-row">
          <span className="habit-emoji">{habit.name.split(' ')[0]}</span>
          <h3>{habit.name}</h3>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="calendar-weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {days.map((day) => {
            if (day.empty) {
              return <div key={day.key} className="calendar-day empty" />;
            }

            return (
              <div
                key={day.key}
                className={`calendar-day ${day.isCompleted ? 'completed' : ''} ${
                  day.isToday ? 'today' : ''
                } ${day.isPast && !day.isCompleted ? 'missed' : ''}`}
              >
                {day.day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="habit-stats-row">
        <div className="stat-item">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.successRate}%</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{stats.streak}d</div>
        </div>
      </div>
    </div>
  );
}

export default HabitCalendar;
