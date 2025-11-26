import dotenv from "dotenv";
dotenv.config();

const JWTConfig = {
  SECRET: process.env.JWT_SECRET || "your_jwt_secret_key_change_this",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
};

export default JWTConfig;
