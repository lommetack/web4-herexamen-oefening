import { Form, useNavigate, redirect } from "react-router";
import { getCategories } from "../services/categories.js";
import { getCurrentUserId } from "../services/auth.js";
import { createSession } from "../services/sessions.js";

export async function clientLoader() {
  const categories = await getCategories();
  return { categories };
}

export async function clientAction({ request }) {
  if (request.method !== "POST") {
    return null;
  }

  const formData = await request.formData();
  const currentUserId = await getCurrentUserId();

  await createSession({
    userId: currentUserId,
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    duration: parseInt(formData.get("duration"), 10),
    notes: formData.get("notes"),
  });

  return redirect("/");
}

export default function Track({ loaderData }) {
  const { categories } = loaderData;
  const navigate = useNavigate();

  // default date = today
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="form-page">
      <h2 className="form-page__title">Log a Session</h2>
      <Form method="post" className="session-form">
        <div className="form-group">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            className="form-select"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={today}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            id="duration"
            name="duration"
            type="number"
            min="1"
            placeholder="e.g. 90"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            placeholder="What did you watch / play / do?"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            Log it
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
