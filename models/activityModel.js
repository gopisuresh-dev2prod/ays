const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stepCount: { type: Number, required: true, min: 0 },
  sleepHours: { type: Number, required: true, min: 0, max: 24 },
  date: { type: Date, required: true, default: Date.now },
}, {
  timestamps: true // Add timestamps option
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;