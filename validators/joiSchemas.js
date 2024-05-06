const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^\d{10}$/).required(),
  password: Joi.string().min(8).required(),
});

const signinSchema = Joi.object({
  emailOrPhone: Joi.alternatives().try(
    Joi.string().email(),
    Joi.string().pattern(/^\d{10}$/)
  ).required(),
  password: Joi.string().min(8).required(),
});

const activitySchema = Joi.object({
  stepCount: Joi.number().integer().min(0).required(),
  sleepHours: Joi.number().integer().min(0).max(24).required(),
});

module.exports = {
  signupSchema,
  signinSchema,
  activitySchema,
};