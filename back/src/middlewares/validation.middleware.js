import Joi from "joi";
import AppError from "../utils/AppError.js";
import config from "../config/app.config.js";

const passwordSchema = Joi.string()
  .min(config.passLen.min)
  .max(config.passLen.max)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
  });

const signupSchema = Joi.object({
  fullname: Joi.string().trim().min(1).required(),
  phone: Joi.string().pattern(/^09\d{9}$/).required().messages({
    "string.pattern.base":
      "Phone number must start with 09 and be 11 digits",
  }),
  password: passwordSchema,
});

const loginSchema = Joi.object({
  identifier: Joi.alternatives()
    .try(
      Joi.string().email(),
      Joi.string().pattern(/^09\d{9}$/)
    )
    .required(),
  password: Joi.string().min(config.passLen.min).max(config.passLen.max).required(),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new AppError(400, error.message);
  }

  req.body = value;
  next();
};

export const validateSignup = validate(signupSchema);

export const validateLogin = (req, res, next) => {
  validate(loginSchema)(req, res, () => {
    req.body.identifier = req.body.identifier.toLowerCase().trim();
    next();
  });
};
