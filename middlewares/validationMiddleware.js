const { signupSchema, signinSchema, activitySchema } = require('../validators/joiSchemas');

const validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateSignin = (req, res, next) => {
  const { error } = signinSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateActivityInput = (req, res, next) => {
  const { error } = activitySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateSignup,
  validateSignin,
  validateActivityInput,
};