import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // Demos
  // Demos
  layout("routes/demos/layout.tsx", [
    route(
      "demos/vertical-polarization",
      "routes/demos/vertical-polarization.tsx"
    ),
  ]),
] satisfies RouteConfig;
