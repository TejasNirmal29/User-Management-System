import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must contain only alphabets"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .matches(/^\d{10,15}$/)
    .withMessage("Phone must be 10-15 digits"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*\d).{6,}$/)
    .withMessage("Password must contain at least one number"),

  body("address")
    .optional()
    .isLength({ max: 150 })
    .withMessage("Address must not exceed 150 characters"),

  body("state").trim().notEmpty().withMessage("State is required"),

  body("city").trim().notEmpty().withMessage("City is required"),

  body("country").trim().notEmpty().withMessage("Country is required"),

  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required")
    .matches(/^\d{4,10}$/)
    .withMessage("Pincode must be 4-10 digits"),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),
];

export const refreshTokenValidator = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];
