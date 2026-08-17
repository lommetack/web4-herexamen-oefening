import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/warmup", "routes/warmup.tsx"),
] satisfies RouteConfig;
