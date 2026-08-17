import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("/habits", "routes/habits.jsx"),
  route("/habits/new", "routes/add-habit.jsx"),
  route("/habits/:habitId", "routes/edit-habit.jsx"),
];
