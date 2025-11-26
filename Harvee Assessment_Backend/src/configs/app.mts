const AppConfig = {
  NAME: "User Management API",
  PORT: process.env.APP_PORT,
  PREFIX: {
    V1: "/api/v1",
    V2: "/api/v2",
  },
};

export default AppConfig;
