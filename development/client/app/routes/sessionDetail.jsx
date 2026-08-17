import { Link, useLoaderData, useNavigate } from "react-router";
import { CalendarDays, Clock, FileText } from "lucide-react";
import { formatDuration, formatDate } from "../utils/index.js";
import { getSessionWithRelations } from "../services/sessions.js";
import { getCurrentUserId } from "../services/auth.js";

/**
 * params bevat de dynamische stukken uit de URL.
 * De route is "sessions/:sessionId", dus params.sessionId is het id.
 */
export async function clientLoader({ params }) {
  const session = await getSessionWithRelations(params.sessionId);
  const currentUserId = await getCurrentUserId();

  return { session, currentUserId };
}

export default function SessionDetail() {
  const { session, currentUserId } = useLoaderData();
  const navigate = useNavigate();

  const { user, category } = session;
  const isOwn = session.userId === currentUserId;

  return (
    <div className="form-page">
      <div className="page-header">
        <h2 className="page-header__title">
          {category.emoji} {category.name}
        </h2>
      </div>

      <div className="session-detail__row">
        <CalendarDays size={16} />
        <span>{formatDate(session.date)}</span>
      </div>
      <div className="session-detail__row">
        <Clock size={16} />
        <span>
          {formatDuration(session.duration)} ({session.duration} minutes)
        </span>
      </div>
      {session.notes && (
        <div className="session-detail__row">
          <FileText size={16} />
          <span>{session.notes}</span>
        </div>
      )}

      <div className="session-detail__row" style={{ marginTop: "8px" }}>
        <Link to={`/users/${user.id}`} className="user-card__name">
          {user.avatar} {user.name}
        </Link>
      </div>

      <div className="session-detail__actions">
        {isOwn && (
          <Link
            to={`/sessions/${session.id}/edit`}
            className="btn btn--primary"
          >
            Edit
          </Link>
        )}
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
}
