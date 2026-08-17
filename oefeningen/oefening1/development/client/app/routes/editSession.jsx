import { redirect, useLoaderData } from "react-router";
import { SessionForm } from "../components/SessionForm.jsx";
import { getSession, updateSession } from "../services/sessions.js";
import { getCurrentUserId } from "../services/auth.js";

/**
 * Alleen de eigenaar mag bewerken -> anders terug naar de feed.
 */
export async function clientLoader({ params }) {
  const session = await getSession(params.sessionId);
  const currentUserId = await getCurrentUserId();

  if (session.userId !== currentUserId) {
    return redirect("/");
  }

  return { session };
}

export async function clientAction({ request, params }) {
  const formData = await request.formData();
  const currentUserId = await getCurrentUserId();

  await updateSession({
    id: params.sessionId,
    date: formData.get("date"),
    duration: Number(formData.get("duration")),
    notes: formData.get("notes"),
  });

  return redirect(`/users/${currentUserId}`);
}

export default function EditSession() {
  const { session } = useLoaderData();

  return (
    <div className="form-page">
      <h2 className="form-page__title">Edit Session</h2>
      <SessionForm session={session} submitLabel="Save" />
    </div>
  );
}
