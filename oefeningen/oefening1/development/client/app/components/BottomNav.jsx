import { NavLink } from "react-router";
import { Rss, Plus, Users } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="bottom-nav" data-testid="bottom-nav">
      <NavLink to="/" end className="bottom-nav__item" data-testid="nav-feed">
        <Rss size={22} />
        <span>Feed</span>
      </NavLink>
      <NavLink
        to="/track"
        className="bottom-nav__item bottom-nav__item--track"
        data-testid="nav-track"
      >
        <Plus size={26} />
        <span>Track</span>
      </NavLink>
      <NavLink
        to="/friends"
        className="bottom-nav__item"
        data-testid="nav-friends"
      >
        <Users size={22} />
        <span>Friends</span>
      </NavLink>
    </nav>
  );
}
