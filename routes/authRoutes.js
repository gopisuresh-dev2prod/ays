const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateSignup, validateSignin } = require("../middlewares/validationMiddleware");

router.post("/register", validateSignup, authController.signup);
router.post("/login", validateSignin, authController.signin);

module.exports = router;