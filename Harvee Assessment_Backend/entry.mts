import dotenv from "dotenv";

const nodeEnv = process.env.NODE_ENV || "development";
const envFile = nodeEnv === "development" ? ".env.develop" : `.env.${nodeEnv}`;

dotenv.config({
  path: envFile,
});

if (!process.env.APP_PORT) {
  dotenv.config({
    path: ".env",
  });
}

console.log(`Loading environment: ${nodeEnv}`);
console.log(`Using env file: ${envFile}`);

import("./src/app.mts")
  .then((res) => {
    // DO SOMETHING
  })
  .catch((err) => {
    console.error("Failed to start application:", err);
    process.exit(1);
  });
