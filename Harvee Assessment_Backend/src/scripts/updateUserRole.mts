import dotenv from "dotenv";
import MongooseService from "@lib/dbClient.mts";
import User from "@models/User.mts";

// Load environment variables
dotenv.config({ path: ".env.develop" });

const updateUserRole = async (email: string, role: "user" | "admin") => {
  try {
    // Connect to database
    const mongooseService = MongooseService.getInstance();
    await mongooseService.connect();
    console.log("Connected to database");

    // Update user role
    const result = await User.updateOne(
      { email: email },
      { $set: { role: role } }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ User with email ${email} not found`);
    } else if (result.modifiedCount === 0) {
      console.log(`ℹ️  User ${email} already has role: ${role}`);
    } else {
      console.log(`✅ User ${email} role updated to: ${role}`);
    }

    // Disconnect from database
    await mongooseService.disconnect();
    console.log("Disconnected from database");
    process.exit(0);
  } catch (error) {
    console.error("Error updating user role:", error);
    process.exit(1);
  }
};

// Get command line arguments
const email = process.argv[2];
const role = process.argv[3] as "user" | "admin";

if (!email || !role) {
  console.error("Usage: npm run update-role <email> <role>");
  console.error("Example: npm run update-role admin@gmail.com admin");
  process.exit(1);
}

if (role !== "user" && role !== "admin") {
  console.error("Role must be either 'user' or 'admin'");
  process.exit(1);
}

// Run the script
updateUserRole(email, role);
