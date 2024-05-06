const Activity = require("../models/activityModel");
const User = require("../models/userModel");

exports.createActivity = async (req, res) => {
  try {
    const { stepCount, sleepHours } = req.body;
    const userId = req.userId;

    // Get the current date with time set to 00:00:00
    const currentDate = new Date().setHours(0, 0, 0, 0);

    // Check if the user has already logged an activity for the current date
    const existingActivity = await Activity.findOne({
      user: userId,
      date: currentDate,
    });

    if (existingActivity) {
      return res
        .status(400)
        .json({ error: "You have already logged an activity for today" });
    }

    const activity = await Activity.create({
      user: userId,
      stepCount,
      sleepHours,
      date: currentDate,
    });

    // Update user document to include a reference to the newly created activity
    await User.findByIdAndUpdate(userId, { $push: { activities: activity._id } });

    res.status(201).json({ activity });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.deleteActivityForCurrentDate = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the activity for the current date associated with the user
    const activityToDelete = await Activity.findOneAndDelete({
      user: userId,
      date: new Date().setHours(0, 0, 0, 0),
    });

    if (!activityToDelete) {
      return res.status(404).json({ error: "No activity found for today" });
    }

    // Remove the reference to the deleted activity from the user document
    await User.findByIdAndUpdate(userId, { $pull: { activities: activityToDelete._id } });

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
