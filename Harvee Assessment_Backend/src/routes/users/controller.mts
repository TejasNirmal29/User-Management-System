import { Request, Response } from "express";
import User from "@models/User.mts";
import HttpResponse from "@utils/response.mts";
import { AuthRequest } from "@/types/main.mts";
import fs from "fs";
import path from "path";

class UserController {
  // Get all users (Admin only)
  public static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        name,
        state,
        city,
        page = 1,
        limit = 10,
        sort = "-createdAt",
      } = req.query;

      // Build filter
      const filter: any = {};

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Specific name filter
      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }

      if (state) {
        filter.state = state;
      }

      if (city) {
        filter.city = city;
      }

      // Pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Get users
      const users = await User.find(filter)
        .select("-password -refreshToken")
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum);

      const total = await User.countDocuments(filter);

      HttpResponse.ok(
        res,
        {
          users,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
          },
        },
        "Users retrieved successfully"
      );
    } catch (error: any) {
      HttpResponse.internalServerError(res, "Failed to retrieve users", error);
    }
  }

  // Get user by ID
  // Note: Users can view their own profile, admins can view any profile
  public static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const authReq = req as AuthRequest;
      const currentUser = authReq.user;

      // Check if user is viewing their own profile or is admin
      if (currentUser?.role !== "admin" && currentUser?.id !== id) {
        return HttpResponse.forbidden(
          res,
          "You don't have permission to view this user"
        );
      }

      const user = await User.findById(id).select("-password -refreshToken");

      if (!user) {
        return HttpResponse.notFound(res, "User not found");
      }

      HttpResponse.ok(res, { user }, "User retrieved successfully");
    } catch (error: any) {
      HttpResponse.internalServerError(res, "Failed to retrieve user", error);
    }
  }

  // Update user
  // Note: Users can edit their own profile, admins can edit any profile
  public static async updateUser(req: Request, res: Response): Promise<void> {
    let uploadedFilePath: string | null = null;

    try {
      const { id } = req.params;
      const authReq = req as AuthRequest;
      const currentUser = authReq.user;

      // Check if user is updating their own profile or is admin
      if (currentUser?.role !== "admin" && currentUser?.id !== id) {
        // Delete uploaded file if unauthorized
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return HttpResponse.forbidden(
          res,
          "You don't have permission to update this user"
        );
      }

      const updateData: any = { ...req.body };

      // Check if email or phone already exists (excluding current user)
      if (updateData.email || updateData.phone) {
        const existingUser = await User.findOne({
          _id: { $ne: id }, // Exclude current user
          $or: [
            ...(updateData.email ? [{ email: updateData.email }] : []),
            ...(updateData.phone ? [{ phone: updateData.phone }] : []),
          ],
        });

        if (existingUser) {
          // Delete uploaded file if validation fails
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }

          // Check which field is duplicate
          if (existingUser.email === updateData.email) {
            return HttpResponse.conflict(res, "Email already exists");
          }
          if (existingUser.phone === updateData.phone) {
            return HttpResponse.conflict(res, "Phone number already exists");
          }
        }
      }

      // Don't allow role change unless admin
      if (updateData.role && currentUser?.role !== "admin") {
        delete updateData.role;
      }

      // Don't allow password change through this endpoint
      delete updateData.password;

      // Store uploaded file path temporarily
      if (req.file) {
        uploadedFilePath = req.file.path;
      }

      // Find existing user to get old image
      const existingUser = await User.findById(id);

      if (!existingUser) {
        // Delete uploaded file if user not found
        if (uploadedFilePath) {
          fs.unlinkSync(uploadedFilePath);
        }
        return HttpResponse.notFound(res, "User not found");
      }

      // Handle profile image update
      if (req.file) {
        // Delete old profile image if exists
        if (existingUser.profile_image) {
          const oldImagePath = path.join(
            process.cwd(),
            existingUser.profile_image
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateData.profile_image = `/uploads/${req.file.filename}`;
      }

      // Update user
      const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).select("-password -refreshToken");

      if (!user) {
        // Delete uploaded file if update fails
        if (uploadedFilePath) {
          fs.unlinkSync(uploadedFilePath);
        }
        return HttpResponse.notFound(res, "User not found");
      }

      HttpResponse.ok(res, { user }, "User updated successfully");
    } catch (error: any) {
      // Delete uploaded file if any error occurs
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      if (error.name === "ValidationError") {
        return HttpResponse.validationError(res, error.errors);
      }
      HttpResponse.internalServerError(res, "Failed to update user", error);
    }
  }

  // Delete user (Admin only)
  public static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return HttpResponse.notFound(res, "User not found");
      }

      // Delete user's profile image if exists
      if (user.profile_image) {
        const imagePath = path.join(process.cwd(), user.profile_image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Delete user
      await User.findByIdAndDelete(id);

      HttpResponse.ok(res, null, "User deleted successfully");
    } catch (error: any) {
      HttpResponse.internalServerError(res, "Failed to delete user", error);
    }
  }
}

export default UserController;
