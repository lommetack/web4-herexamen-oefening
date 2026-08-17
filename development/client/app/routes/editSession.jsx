import { useNavigate, redirect } from "react-router";
import { SessionForm } from "../components/SessionForm.jsx";
import { getSession } from "../services/sessions.js";
import { getCurrentUserId } from "../services/auth.js";
import { updateSession } from "../services/sessions.js";

export async function clientLoader({ params }) {
  const session = await getSession(params.sessionId);
  const currentUserId = await getCurrentUserId();

  // Only allow editing own sessions
  if (session.userId !== currentUserId) {
    return redirect("/");
  }

  return { session, currentUserId };
}

export async function clientAction({ request, params }) {
  if (request.method !== "POST") {
    return null;
  }

  const formData = await request.formData();
  const sessionId = params.sessionId;
  const currentUserId = await getCurrentUserId();

  await updateSession({
    id: sessionId,
    date: formData.get("date"),
    duration: parseInt(formData.get("duration"), 10),
    notes: formData.get("notes"),
  });

  return redirect(`/users/${currentUserId}`);
}

export default function EditSession({ loaderData }) {
  const { session } = loaderData;
  const navigate = useNavigate();

  return (
    <div className="form-page">
      <h2 className="form-page__title">Edit Session</h2>
      <SessionForm session={session} submitLabel="Save" />
      <button
        type="button"
        className="btn btn--ghost"
        onClick={() => navigate(-1)}
        style={{ marginTop: "1rem" }}
      >
        Cancel
      </button>
    </div>
  );
}
