import { lazy } from "react";

const profileRoutes = [
  {
    path: "/profile",
    component: lazy(() => import("@views/Profile")),
    protected: true,
  },
];

export default profileRoutes;
