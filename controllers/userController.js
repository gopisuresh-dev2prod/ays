const User = require("../models/userModel");
const Activity = require("../models/activityModel");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("activities")
      .populate("subscription.plan");
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getUserSubscriptionPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate('subscription.plan');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subscriptionPlan = user.subscription.plan;

    if (!subscriptionPlan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    res.status(200).json({ subscriptionPlan });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getUserActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.userId });
    res.status(200).json({ activities });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserAnalysis = async (req, res) => {
  try {
    const userId = req.userId;
    const activities = await Activity.find({ user: userId });
    const totalSteps = activities.reduce((acc, activity) => acc + activity.stepCount, 0);
    const totalSleepHours = activities.reduce((acc, activity) => acc + activity.sleepHours, 0);

    const rankedUsers = await getUsersRankedBySteps();
    const currentUserRank = rankedUsers.findIndex((user) => user._id.toString() === userId.toString()) + 1;

    const similarUsers = rankedUsers.filter(
      (user, index) =>
        Math.abs(index - (currentUserRank - 1)) <= 5 && user._id.toString() !== userId.toString()
    );

    const analysis = {
      totalSteps,
      totalSleepHours,
      averageStepsPerDay: totalSteps / activities.length,
      averageSleepHoursPerDay: totalSleepHours / activities.length,
      rank: currentUserRank,
      similarUsers,
    };

    res.status(200).json({ analysis });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = req.query;
    const skip = (page - 1) * limit;
    const sortOption = sortOrder === "desc" ? `-${sortBy}` : sortBy;

    const users = await User.find({}, { password: 0 })
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments();

    res.status(200).json({ users, totalUsers, page, limit });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.deleteSingleUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // // Check if the user has any associated activities
    // const hasActivities = user.activities.length > 0;

    // // If the user has activities, prompt for confirmation
    // if (hasActivities) {
    //   return res.status(400).json({
    //     error: "This user has associated activities. Are you sure you want to delete?",
    //     user,
    //   });
    // }

    // If no associated activities, proceed with deletion
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAllUsers = async (req, res) => {
  try {
    // Check if there are any users in the database
    const totalUsers = await User.countDocuments();
    if (totalUsers === 0) {
      return res.status(404).json({ error: "No users found" });
    }

   // Proceed with deleting all users
   await User.deleteMany({});
   return res.status(200).json({ message: "All users have been successfully deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAllUsersActivities = async (req, res) => {
  try {
    const activities = await Activity.find().populate("user", "name");
    res.status(200).json({ activities });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.getAllUsersAnalysis = async (req, res) => {
//   try {
//     const activities = await Activity.find();
//     const totalSteps = activities.reduce((acc, activity) => acc + activity.stepCount, 0);
//     const totalSleepHours = activities.reduce((acc, activity) => acc + activity.sleepHours, 0);
//     const totalUsers = await User.countDocuments();
//     const analysis = {
//       totalSteps,
//       totalSleepHours,
//       averageStepsPerUser: totalSteps / totalUsers,
//       averageSleepHoursPerUser: totalSleepHours / totalUsers,
//     };
//     res.status(200).json({ analysis });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const getUsersRankedBySteps = async () => {
  const users = await User.find({}, { activities: 1 })
    .populate({
      path: "activities",
      select: "stepCount",
    })
    .lean();

  const usersWithTotalSteps = users.map((user) => ({
    ...user,
    totalSteps: user.activities.reduce((acc, activity) => acc + activity.stepCount, 0),
  }));

  const sortedUsers = usersWithTotalSteps.sort((a, b) => b.totalSteps - a.totalSteps);

  return sortedUsers;
};
exports.getAllUsersAnalysis = async (req, res) => {
  try {
    const users = await User.find({}, 'name email phoneNumber activities')
      .populate({
        path: 'activities',
        select: 'stepCount sleepHours',
      })
      .lean();

    const totalUsers = users.length;

    const rankedUsers = users.map((user) => {
      const userActivities = user.activities || [];
      const totalSteps = userActivities.reduce((acc, activity) => acc + activity.stepCount, 0);
      const totalSleepHours = userActivities.reduce((acc, activity) => acc + activity.sleepHours, 0);

      return {
        ...user,
        totalSteps,
        totalSleepHours,
      };
    });

    const sortedUsers = rankedUsers.sort((a, b) => b.totalSteps - a.totalSteps);
    const topTenUsers = sortedUsers.slice(0, 10);

    const totalSteps = sortedUsers.reduce((acc, user) => acc + user.totalSteps, 0);
    const totalSleepHours = sortedUsers.reduce((acc, user) => acc + user.totalSleepHours, 0);

    const analysis = {
      totalSteps,
      totalSleepHours,
      averageStepsPerUser: totalUsers > 0 ? totalSteps / totalUsers : 0,
      averageSleepHoursPerUser: totalUsers > 0 ? totalSleepHours / totalUsers : 0,
      topTenUsers,
    };

    res.status(200).json({ analysis });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAllActivities = async (req, res) => {
  try {
    const userId = req.userId;

    // Delete all activity documents associated with the user
    await Activity.deleteMany({ user: userId });

    // Remove the references to the deleted activities from the user document
    await User.findByIdAndUpdate(userId, { $set: { activities: [] } });

    res.status(200).json({ message: "All activities deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};