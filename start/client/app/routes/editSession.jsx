import { SessionForm } from "../components/SessionForm.jsx";

export default function EditSession() {
  const { session } = {};
  return (
    <div className="form-page">
      <h2 className="form-page__title">Edit Session</h2>
      <SessionForm session={session} submitLabel="Save" />
    </div>
  );
}
