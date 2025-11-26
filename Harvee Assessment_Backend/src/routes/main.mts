import authRoutes from "./auth/route.mts";
import userRoutes from "./users/route.mts";

const routes = {
  auth: authRoutes,
  users: userRoutes,
};

export default routes;
