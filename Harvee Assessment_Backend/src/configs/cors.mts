import { CorsOptions } from "cors";

const corsConfig: CorsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "api-access-key"],
};

export default corsConfig;
