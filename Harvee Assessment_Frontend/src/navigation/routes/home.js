import { lazy } from "react";

const homeRoutes = [
  {
    path: "/dashboard",
    component: lazy(() => import("@views/Dashboard")),
    protected: true,
  },
  {
    path:"/dashboard/edit-user/:id",
    component: lazy(() => import("@views/Dashboard/Edit")),
    protected: true,
  }
];

export default homeRoutes;
