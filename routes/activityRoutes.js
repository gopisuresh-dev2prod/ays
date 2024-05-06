const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const authMiddleware = require("../middlewares/authMiddleware");
const { validateActivityInput } = require("../middlewares/validationMiddleware");

router.post(
  "/add",
  authMiddleware,
  validateActivityInput,
  activityController.createActivity
);
// router.get('/top-data',  authMiddleware,getTopData);
module.exports = router;






