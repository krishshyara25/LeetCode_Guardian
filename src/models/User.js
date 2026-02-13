const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegramId: Number,
  telegramUsername: String,
  leetcodeUsername: {
    type: String,
    unique: true
  },

  currentStreak: {
    type: Number,
    default: 0
  },

  lastSubmissionDate: Date,

  totalSolvedToday: {
    type: Number,
    default: 0
  },

  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
