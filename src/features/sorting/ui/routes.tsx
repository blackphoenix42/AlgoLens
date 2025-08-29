import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const VisualizerPage = lazy(() => import("@/pages/VisualizerPage"));

const routes: RouteObject[] = [
  { path: "/sorting/:algo", element: <VisualizerPage /> },
];

export default routes;
