import { Router } from "express";
import AuthController from "./controller.mts";
import JWTService from "@lib/jwt.mts";
import { upload } from "@middlewares/upload.mts";
import validate from "@middlewares/validator.mts";
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
} from "@validators/auth.mts";

const router = Router();

router.post(
  "/register",
  upload.single("profile_image"),
  registerValidator,
  validate,
  AuthController.register
);
router.post("/login", loginValidator, validate, AuthController.login);
router.post(
  "/refresh-token",
  refreshTokenValidator,
  validate,
  AuthController.refreshToken
);
router.post("/logout", JWTService.isAuth, AuthController.logout);

export default router;
