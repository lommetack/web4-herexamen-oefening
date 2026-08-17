import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("/explore", "routes/explore.jsx"),
  route("/create", "routes/create.jsx"),
  route("/profile", "routes/profile.jsx"),
  route("/activity", "routes/activity.jsx"),
];
