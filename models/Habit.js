const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a habit name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  goal: {
    type: Number,
    default: 1
  },
  completions: [{
    date: {
      type: Date,
      required: true
    },
    count: {
      type: Number,
      default: 1
    },
    notes: String
  }],
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Method to calculate streak
habitSchema.methods.calculateStreak = function() {
  if (this.completions.length === 0) {
    return { current: 0, longest: 0 };
  }

  const sortedCompletions = this.completions
    .map(c => new Date(c.date))
    .sort((a, b) => b - a);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastCompletion = new Date(sortedCompletions[0]);
  lastCompletion.setHours(0, 0, 0, 0);

  if (lastCompletion.getTime() === today.getTime() ||
      lastCompletion.getTime() === yesterday.getTime()) {
    currentStreak = 1;

    for (let i = 1; i < sortedCompletions.length; i++) {
      const current = new Date(sortedCompletions[i]);
      current.setHours(0, 0, 0, 0);
      const previous = new Date(sortedCompletions[i - 1]);
      previous.setHours(0, 0, 0, 0);

      const dayDiff = Math.floor((previous - current) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        currentStreak++;
        tempStreak++;
      } else {
        tempStreak = 1;
      }

      longestStreak = Math.max(longestStreak, tempStreak);
    }

    longestStreak = Math.max(longestStreak, currentStreak);
  } else {
    currentStreak = 0;

    for (let i = 1; i < sortedCompletions.length; i++) {
      const current = new Date(sortedCompletions[i]);
      current.setHours(0, 0, 0, 0);
      const previous = new Date(sortedCompletions[i - 1]);
      previous.setHours(0, 0, 0, 0);

      const dayDiff = Math.floor((previous - current) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }

      longestStreak = Math.max(longestStreak, tempStreak);
    }
  }

  return { current: currentStreak, longest: longestStreak };
};

module.exports = mongoose.model('Habit', habitSchema);
