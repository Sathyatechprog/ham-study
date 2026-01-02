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
    route(
      "demos/horizontal-polarization",
      "routes/demos/horizontal-polarization.tsx"
    ),
    route(
      "demos/circular-polarization",
      "routes/demos/circular-polarization.tsx"
    ),
    route(
      "demos/elliptical-polarization",
      "routes/demos/elliptical-polarization.tsx"
    ),
  ]),
] satisfies RouteConfig;
