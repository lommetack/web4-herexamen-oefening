import { UserCard } from "../components/UserCard.jsx";

export default function Friends() {
  const { users, follows, currentUserId } = {};

  /* query and setQuery should be declared in another way...  */
  const query = "";
  const setQuery = undefined;

  const otherUsers = users.filter((u) => u.id !== currentUserId);

  const followingIds = new Set(follows.map((f) => f.followingId));

  const filtered = query.trim()
    ? otherUsers.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase()),
      )
    : otherUsers.filter((u) => followingIds.has(u.id));

  return (
    <div>
      <div className="page-header">
        <h2 className="page-header__title">Friends</h2>
      </div>

      <div className="friends-search">
        <input
          className="friends-search__input"
          type="search"
          placeholder="Search people…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <ul className="user-list" data-testid="friends-list">
        {filtered.map((user) => {
          const follow = follows.find((f) => f.followingId === user.id);
          const isFollowing = Boolean(follow);
          return (
            <li key={user.id}>
              <UserCard
                user={user}
                isFollowing={isFollowing}
                followId={follow?.id}
              />
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <p className="friends-empty">No results for &ldquo;{query}&rdquo;</p>
      )}
    </div>
  );
}
