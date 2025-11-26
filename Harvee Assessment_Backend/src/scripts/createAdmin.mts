import dotenv from "dotenv";
import MongooseService from "@lib/dbClient.mts";
import User from "@models/User.mts";
import BcryptService from "@lib/bcrypt.mts";

// Load environment variables
dotenv.config({ path: ".env.develop" });

const createAdminUser = async () => {
  try {
    // Connect to database
    const mongooseService = MongooseService.getInstance();
    await mongooseService.connect();
    console.log("Connected to database");

    const adminEmail = "admin@gmail.com";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists. Updating role...");

      // Update existing user to admin
      await User.updateOne({ email: adminEmail }, { $set: { role: "admin" } });

      console.log(`✅ User ${adminEmail} has been set as admin`);
    } else {
      console.log("Admin user does not exist. Creating new admin user...");

      // Create new admin user
      const hashedPassword = await BcryptService.hashPassword("Admin@123");

      const adminUser = new User({
        name: "Admin User",
        email: adminEmail,
        phone: "9999999999",
        password: hashedPassword,
        address: "Admin Address",
        state: "Admin State",
        city: "Admin City",
        country: "Admin Country",
        pincode: "123456",
        role: "admin",
      });

      await adminUser.save();
      console.log(`✅ Admin user created successfully`);
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: Admin@123`);
    }

    // Disconnect from database
    await mongooseService.disconnect();
    console.log("Disconnected from database");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

// Run the script
createAdminUser();
