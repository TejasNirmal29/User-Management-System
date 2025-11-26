import { Router } from "express";
import UserController from "./controller.mts";
import JWTService from "@lib/jwt.mts";
import { isAdmin } from "@middlewares/role.mts";
import { upload } from "@middlewares/upload.mts";
import validate from "@middlewares/validator.mts";
import {
  getAllUsersValidator,
  getUserByIdValidator,
  updateUserValidator,
  deleteUserValidator,
} from "@validators/user.mts";

const router = Router();

// Protected routes

router.get(
  "/",
  JWTService.isAuth,
  isAdmin,
  getAllUsersValidator,
  validate,
  UserController.getAllUsers
);

router.get(
  "/:id",
  JWTService.isAuth,
  getUserByIdValidator,
  validate,
  UserController.getUserById
);

router.put(
  "/:id",
  JWTService.isAuth,
  upload.single("profile_image"),
  updateUserValidator,
  validate,
  UserController.updateUser
);

router.delete(
  "/:id",
  JWTService.isAuth,
  isAdmin,
  deleteUserValidator,
  validate,
  UserController.deleteUser
);

export default router;
