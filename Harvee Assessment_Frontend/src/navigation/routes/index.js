import authRoutes from "./auth";
import homeRoutes from "./home";
import pagesRoutes from "./pages";
import profileRoutes from "./profile";

const routes = [...pagesRoutes, ...authRoutes, ...homeRoutes, ...profileRoutes];

export default routes;
