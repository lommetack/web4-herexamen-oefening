import { NavLink, Outlet, useNavigation } from "react-router";
import "./sidebar.css";
import { fetchFavorites } from "../services/catApi";

export async function clientLoader() {
  const favorites = await fetchFavorites();
  return { favorites };
}

const Sidebar = () => {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <div className="app-layout">
      {isNavigating && (
        <div className="global-spinner">Loading...</div>
      )}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Cat Explorer</h2>
        </div>
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/random">Random Cats</NavLink>
          </li>
          <li>
            <NavLink to="/breeds">Breed Directory</NavLink>
          </li>
          <li>
            <NavLink to="/favorites">My Favorites</NavLink>
          </li>
        </ul>
      </nav>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
