import { body, param, query } from "express-validator";

export const getUserByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),
];

export const updateUserValidator = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must contain only alphabets"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(/^\d{10,15}$/)
    .withMessage("Phone must be 10-15 digits"),

  body("address")
    .optional()
    .isLength({ max: 150 })
    .withMessage("Address must not exceed 150 characters"),

  body("state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty"),

  body("city").optional().trim().notEmpty().withMessage("City cannot be empty"),

  body("country")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country cannot be empty"),

  body("pincode")
    .optional()
    .trim()
    .matches(/^\d{4,10}$/)
    .withMessage("Pincode must be 4-10 digits"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
];

export const deleteUserValidator = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),
];

export const getAllUsersValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sort").optional().isString().withMessage("Sort must be a string"),

  query("search").optional().isString().withMessage("Search must be a string"),

  query("name").optional().isString().withMessage("Name must be a string"),

  query("state").optional().isString().withMessage("State must be a string"),

  query("city").optional().isString().withMessage("City must be a string"),
];
