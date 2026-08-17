import { Rss, Plus, Users } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="bottom-nav" data-testid="bottom-nav">
      <a href="/" end className="bottom-nav__item" data-testid="nav-feed">
        <Rss size={22} />
        <span>Feed</span>
      </a>
      <a
        href="/track"
        className="bottom-nav__item bottom-nav__item--track"
        data-testid="nav-track"
      >
        <Plus size={26} />
        <span>Track</span>
      </a>
      <a href="/friends" className="bottom-nav__item" data-testid="nav-friends">
        <Users size={22} />
        <span>Friends</span>
      </a>
    </nav>
  );
}
