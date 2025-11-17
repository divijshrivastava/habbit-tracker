const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/analytics/overview
// @desc    Get analytics overview for all habits
// @access  Private
router.get('/overview', async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isActive: true });

    const totalHabits = habits.length;
    let totalCompletions = 0;
    let activeStreaks = 0;
    let longestStreak = 0;

    habits.forEach(habit => {
      totalCompletions += habit.completions.length;
      const streakData = habit.calculateStreak();
      if (streakData.current > 0) {
        activeStreaks++;
      }
      longestStreak = Math.max(longestStreak, streakData.longest);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let completedToday = 0;
    habits.forEach(habit => {
      const todayCompletion = habit.completions.find(c => {
        const cDate = new Date(c.date);
        cDate.setHours(0, 0, 0, 0);
        return cDate.getTime() === today.getTime();
      });
      if (todayCompletion) {
        completedToday++;
      }
    });

    const completionRate = totalHabits > 0 ? ((completedToday / totalHabits) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalHabits,
        totalCompletions,
        activeStreaks,
        longestStreak,
        completedToday,
        todayCompletionRate: completionRate
      }
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
        status: 400
      }
    });
  }
});

// @route   GET /api/analytics/habit/:id
// @desc    Get detailed analytics for a specific habit
// @access  Private
router.get('/habit/:id', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        error: {
          message: 'Habit not found',
          status: 404
        }
      });
    }

    // Check ownership
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          message: 'Not authorized to access this habit',
          status: 403
        }
      });
    }

    const streakData = habit.calculateStreak();
    const totalCompletions = habit.completions.length;

    // Calculate completion rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCompletions = habit.completions.filter(c =>
      new Date(c.date) >= thirtyDaysAgo
    );

    const completionRate = ((recentCompletions.length / 30) * 100).toFixed(1);

    // Get completion history (last 30 days)
    const completionHistory = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const completion = habit.completions.find(c => {
        const cDate = new Date(c.date);
        cDate.setHours(0, 0, 0, 0);
        return cDate.getTime() === date.getTime();
      });

      completionHistory.push({
        date: date.toISOString().split('T')[0],
        completed: !!completion,
        count: completion ? completion.count : 0
      });
    }

    // Simple projection (based on recent completion rate)
    const projectedSuccessRate = completionRate;

    res.json({
      success: true,
      data: {
        habitId: habit._id,
        habitName: habit.name,
        totalCompletions,
        currentStreak: streakData.current,
        longestStreak: streakData.longest,
        completionRate: completionRate + '%',
        completionHistory,
        projection: {
          next30Days: projectedSuccessRate + '%',
          likelihood: projectedSuccessRate > 70 ? 'high' : projectedSuccessRate > 40 ? 'medium' : 'low'
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
        status: 400
      }
    });
  }
});

module.exports = router;
