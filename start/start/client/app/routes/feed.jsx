import { FeedItem } from "../components/FeedItem.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { Rss } from "lucide-react";

export default function Feed() {
  const { feedSessions } = {};

  if (feedSessions.length === 0) {
    return (
      <EmptyState
        icon={<Rss size={44} />}
        title="Nothing here yet"
        message="Follow friends to see their lazy sessions."
        testId="empty-feed"
      />
    );
  }

  return (
    <div className="feed" data-testid="feed">
      {feedSessions.map((session) => (
        <FeedItem key={session.id} session={session} />
      ))}
    </div>
  );
}
