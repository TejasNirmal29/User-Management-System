import { Request, Response } from "express";
import User from "@models/User.mts";
import JWTService from "@lib/jwt.mts";
import BcryptService from "@lib/bcrypt.mts";
import HttpResponse from "@utils/response.mts";
import MESSAGES from "@constants/message.mts";
import JWTConfig from "@configs/jwt.mts";
import fs from "fs";
import path from "path";

class AuthController {
  // USER REGISTRATION
  public static async register(req: Request, res: Response): Promise<void> {
    let uploadedFilePath: string | null = null;

    try {
      const {
        name,
        email,
        phone,
        password,
        address,
        state,
        city,
        country,
        pincode,
      } = req.body;

      // Validate password complexity (min 6 chars with at least one number)
      const passwordRegex = /^(?=.*\d).{6,}$/;
      if (!passwordRegex.test(password)) {
        // Delete uploaded file if validation fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return HttpResponse.badRequest(
          res,
          "Password must be at least 6 characters and contain at least one number"
        );
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
      });

      if (existingUser) {
        // Delete uploaded file if user exists
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return HttpResponse.conflict(
          res,
          MESSAGES.ERROR.EMAIL_OR_PHONE_ALREADY_EXISTS
        );
      }

      if (req.file) {
        uploadedFilePath = req.file.path;
      }

      // Hash password using BcryptService
      const hashedPassword = await BcryptService.hashPassword(password);

      // Create new user (without image first)
      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        profile_image: null,
        address,
        state,
        city,
        country,
        pincode,
      });

      // Save user to database
      const savedUser = await newUser.save();

      if (!savedUser) {
        if (uploadedFilePath) {
          fs.unlinkSync(uploadedFilePath);
        }
        return HttpResponse.badRequest(res, MESSAGES.ERROR.USER_NOT_REGISTERED);
      }

      if (req.file) {
        savedUser.profile_image = `/uploads/${req.file.filename}`;
        await savedUser.save();
      }

      // Generate tokens
      const accessToken = JWTService.signToken({
        id: savedUser._id.toString(),
        role: savedUser.role,
      });

      const refreshToken = JWTService.generateToken({
        id: savedUser._id.toString(),
      });

      // Save refresh token
      savedUser.refreshToken = refreshToken;
      await savedUser.save();

      return HttpResponse.created(
        res,
        {
          user: {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            phone: savedUser.phone,
            profile_image: savedUser.profile_image,
            address: savedUser.address,
            state: savedUser.state,
            city: savedUser.city,
            country: savedUser.country,
            pincode: savedUser.pincode,
            role: savedUser.role,
          },
          accessToken,
          refreshToken,
          tokenExpiry: {
            accessToken: JWTConfig.ACCESS_TOKEN_EXPIRY,
            refreshToken: JWTConfig.REFRESH_TOKEN_EXPIRY,
          },
        },
        MESSAGES.SUCCESS.USER_REGISTERED
      );
    } catch (error: any) {
      // Delete uploaded file if any error occurs
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      if (error.name === "ValidationError") {
        return HttpResponse.validationError(res, error.errors);
      }
      return HttpResponse.internalServerError(
        res,
        MESSAGES.ERROR.SERVER_ERROR,
        error
      );
    }
  }

  // USER LOGIN
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return HttpResponse.badRequest(res, "Email and password are required");
      }

      // Find user by email
      const foundUser = await User.findOne({ email }).select("+password");

      if (!foundUser) {
        return HttpResponse.badRequest(res, MESSAGES.ERROR.USER_NOT_FOUND);
      }

      // User exists - verify password using BcryptService
      const isMatched = await BcryptService.comparePassword(
        password,
        foundUser.password
      );

      if (!isMatched) {
        return HttpResponse.badRequest(res, MESSAGES.ERROR.INVALID_CREDENTIALS);
      }

      // Password is matched - sign token and respond
      const accessToken = JWTService.signToken({
        id: foundUser._id.toString(),

        role: foundUser.role,
      });

      const refreshToken = JWTService.generateToken({
        id: foundUser._id.toString(),
      });

      // Save refresh token
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      return HttpResponse.ok(
        res,
        {
          user: {
            id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
            phone: foundUser.phone,
            profile_image: foundUser.profile_image,
            address: foundUser.address,
            state: foundUser.state,
            city: foundUser.city,
            country: foundUser.country,
            pincode: foundUser.pincode,
            role: foundUser.role,
          },
          accessToken,
          refreshToken,
          tokenExpiry: {
            accessToken: JWTConfig.ACCESS_TOKEN_EXPIRY,
            refreshToken: JWTConfig.REFRESH_TOKEN_EXPIRY,
          },
        },
        MESSAGES.SUCCESS.USER_LOGGED_IN
      );
    } catch (error) {
      return HttpResponse.internalServerError(
        res,
        MESSAGES.ERROR.SERVER_ERROR,
        error
      );
    }
  }

  // REFRESH TOKEN
  public static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return HttpResponse.badRequest(res, "Refresh token is required");
      }

      const decoded = JWTService.verifyToken(refreshToken);

      if (!decoded) {
        return HttpResponse.unauthorized(
          res,
          MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN
        );
      }

      const user = await User.findById(decoded.id).select("+refreshToken");

      if (!user || user.refreshToken !== refreshToken) {
        return HttpResponse.unauthorized(
          res,
          MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN
        );
      }

      // Generate new tokens (Refresh Token Rotation)
      const newAccessToken = JWTService.signToken({
        id: user._id.toString(),
        role: user.role,
      });

      const newRefreshToken = JWTService.generateToken({
        id: user._id.toString(),
      });

      // Update refresh token
      user.refreshToken = newRefreshToken;
      await user.save();

      return HttpResponse.ok(
        res,
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          tokenExpiry: {
            accessToken: JWTConfig.ACCESS_TOKEN_EXPIRY,
            refreshToken: JWTConfig.REFRESH_TOKEN_EXPIRY,
          },
        },
        "Token refreshed successfully"
      );
    } catch (error: any) {
      return HttpResponse.internalServerError(
        res,
        MESSAGES.ERROR.SERVER_ERROR,
        error
      );
    }
  }

  // USER LOGOUT
  public static async logout(req: Request, res: Response): Promise<void> {
    try {
      const { id } = (req as any).user;

      // Remove refresh token from database
      const user = await User.findById(id);

      if (user) {
        user.refreshToken = undefined;
      
        await user.save();
      }

      return HttpResponse.ok(res, null, MESSAGES.SUCCESS.LOGOUT_SUCCESS);
    } catch (error) {
      console.error(error);
      return HttpResponse.internalServerError(res, MESSAGES.ERROR.SERVER_ERROR);
    }
  }
}

export default AuthController;
