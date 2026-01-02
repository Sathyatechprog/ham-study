import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // Demos
  route(
    "demos/vertical-polarization",
    "routes/demos/vertical-polarization.tsx"
  ),
] satisfies RouteConfig;
