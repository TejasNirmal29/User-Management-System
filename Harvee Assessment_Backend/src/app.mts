import AppConfig from "@/configs/app.mts";
import express from "express";
import routes from "@routes/main.mts";
import MongooseService from "@lib/dbClient.mts";
import cors from "cors";
import corsConfig from "./configs/cors.mts";

const { PORT, PREFIX } = AppConfig;
// Initialize the MongooseService
const mongooseService = MongooseService.getInstance();
(async () => {
  try {
    // Connect to the database
    await mongooseService.connect();
    console.log("Database connected successfully!");

    // Create the express app
    const app = express();

    // Middleware
    app.use(cors(corsConfig)); // configure cors config file as per requirement
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Serve static files (uploaded images)
    app.use("/uploads", express.static("uploads"));

    // Health check endpoint
    app.get("/", (req, res) => {
      res.status(200).json({
        message: `Hello from ${AppConfig.NAME}! env: ${
          process.env.NODE_ENV || "develop"
        }`,
      });
    });

    // Map all app routes (v1)
    Object.entries(routes).map(([name, router]) => {
      const path = `${PREFIX.V1}/${name}`;
      app.use(path, router);
      console.log("Resolved routes - ", path);
    });

    // Start the server
    app.listen(PORT, (error) => {
      if (!error) {
        console.log(`Server is running on http://localhost:${PORT}`);
      } else {
        console.error(error.message);
      }
    });

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Gracefully shutting down...");
      await mongooseService.disconnect();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("Process terminated.");
      await mongooseService.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error("Error initializing the application:", error);
    process.exit(1); // Exit with failure code
  }
})();
