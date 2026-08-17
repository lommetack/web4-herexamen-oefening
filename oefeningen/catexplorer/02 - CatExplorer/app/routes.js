import { index, route, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/sidebar.jsx", [
    index("routes/index.jsx"),
    route("random", "routes/random.jsx"),
    route("breeds", "routes/breeds.jsx"),
    route("breeds/:breedId", "routes/breed-details.jsx"),
    route("favorites", "routes/favorites.jsx"),
    route("favorites-action", "routes/favorites-action.jsx"),
  ]),
];
