import { route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.jsx"),
  route("/boxes/new", "routes/newBox.jsx"),
  route("/boxes/:id", "routes/detailBox.jsx"),
  route("/boxes/edit/:id", "routes/editBox.jsx"),
];
