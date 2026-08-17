import { User } from "lucide-react";

export function AppHeader({ currentUser }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <a href="/" className="app-header__title">
          Couch Potato
        </a>
      </div>
      <a
        href={`/users/${currentUser?.id}`}
        className="app-header__me"
        data-testid="nav-profile"
        aria-label="My profile"
      >
        {currentUser ? (
          <span className="app-header__avatar">{currentUser.avatar}</span>
        ) : (
          <User size={22} />
        )}
        <span>Me</span>
      </a>
    </header>
  );
}
