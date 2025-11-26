import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class MongooseService {
  private static instance: MongooseService;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): MongooseService {
    if (!MongooseService.instance) {
      MongooseService.instance = new MongooseService();
    }
    return MongooseService.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("Already connected to MongoDB");
      return;
    }

    try {
      const mongoUri =
        process.env.MONGO_URI || "mongodb://localhost:27017/user_management";

      if (!process.env.MONGO_URI) {
        console.warn(
          "⚠️  MONGO_URI not found in environment variables. Using default connection string."
        );
      }

      await mongoose.connect(mongoUri);

      this.isConnected = true;
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("MongoDB disconnected successfully");
    } catch (error) {
      console.error("MongoDB disconnection error:", error);
      throw error;
    }
  }

  public getConnection(): typeof mongoose {
    return mongoose;
  }
}

export default MongooseService;
