const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/profile", authMiddleware, userController.getUser);
router.get("/plan", authMiddleware, userController.getUserSubscriptionPlan);
router.get("/activities", authMiddleware, userController.getUserActivities);
router.delete('/activities', authMiddleware, userController.deleteAllActivities);
router.get("/analysis", authMiddleware, userController.getUserAnalysis);
router.delete('/:userId',authMiddleware, userController.deleteSingleUser);

// Route to delete all users
router.delete('/', userController.deleteAllUsers);
router.get("/all", authMiddleware, userController.getAllUsers);
router.get("/all/activities", authMiddleware, userController.getAllUsersActivities);
router.get("/all/analysis", authMiddleware, userController.getAllUsersAnalysis);

module.exports = router;