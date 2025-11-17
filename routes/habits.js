const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/habits
// @desc    Get all habits for the current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort('-createdAt');

    // Calculate streaks for each habit
    habits.forEach(habit => {
      const streakData = habit.calculateStreak();
      habit.streak = streakData;
    });

    res.json({
      success: true,
      count: habits.length,
      data: habits
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

// @route   GET /api/habits/:id
// @desc    Get a single habit
// @access  Private
router.get('/:id', async (req, res) => {
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
    habit.streak = streakData;

    res.json({
      success: true,
      data: habit
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

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', async (req, res) => {
  try {
    const habit = await Habit.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      data: habit
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

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);

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
          message: 'Not authorized to update this habit',
          status: 403
        }
      });
    }

    habit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: habit
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

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', async (req, res) => {
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
          message: 'Not authorized to delete this habit',
          status: 403
        }
      });
    }

    await habit.deleteOne();

    res.json({
      success: true,
      data: {}
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

// @route   POST /api/habits/:id/complete
// @desc    Mark a habit as completed for a specific date
// @access  Private
router.post('/:id/complete', async (req, res) => {
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
          message: 'Not authorized to update this habit',
          status: 403
        }
      });
    }

    const { date, count, notes } = req.body;
    const completionDate = date ? new Date(date) : new Date();
    completionDate.setHours(0, 0, 0, 0);

    // Check if already completed for this date
    const existingCompletion = habit.completions.find(c => {
      const cDate = new Date(c.date);
      cDate.setHours(0, 0, 0, 0);
      return cDate.getTime() === completionDate.getTime();
    });

    if (existingCompletion) {
      return res.status(400).json({
        error: {
          message: 'Habit already completed for this date',
          status: 400
        }
      });
    }

    habit.completions.push({
      date: completionDate,
      count: count || 1,
      notes: notes || ''
    });

    // Update streak
    const streakData = habit.calculateStreak();
    habit.streak = streakData;

    await habit.save();

    res.json({
      success: true,
      data: habit
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
