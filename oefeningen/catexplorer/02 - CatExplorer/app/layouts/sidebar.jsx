import { NavLink, Outlet } from "react-router";
import "./sidebar.css";

// TODO: implement a clientLoader to fetch all the Favourites

const Sidebar = () => {
  return (
    <div className="app-layout">
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
