import { Form, Link, redirect } from "react-router";
import { getHabitById, updateHabit } from "../services/habits";

import "./edit-habit.css";

export function meta() {
  return [
    { title: "Edit Habit - Bad-habit-tracker" },
    { name: "description", content: "Edit a bad habit" },
  ];
}

export async function clientLoader({ params }) {
  const habit = await getHabitById(params.habitId);
  return { habit };
}

export async function clientAction({ request, params }) {
  const formData = await request.formData();
  const id = params.habitId;
  const name = formData.get("name");

  await updateHabit({ id, name });

  return redirect("/habits");
}

export default function EditHabit({ loaderData }) {
  const { habit } = loaderData;

  if (!habit) {
    return (
      <main className="edit-habit">
        <div className="edit-habit__container">
          <h1 className="edit-habit__title">Habit not found</h1>
          <Link to="/habits" className="edit-habit__link">
            Back to Habits
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="edit-habit">
      <div className="edit-habit__container">
        <header className="edit-habit__header">
          <h1 className="edit-habit__title">Edit Habit</h1>
          <Link to="/habits" className="edit-habit__link">
            Back to Habits
          </Link>
        </header>

        <div className="edit-habit__content">
          <Form method="post" className="habit-form">
            <div className="habit-form__field">
              <label htmlFor="name" className="habit-form__label">
                Habit Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="habit-form__input"
                defaultValue={habit.name}
                required
              />
            </div>

            <div className="habit-form__actions">
              <button
                type="submit"
                className="habit-form__button habit-form__button--primary"
              >
                Update Habit
              </button>
              <Link
                to="/habits"
                className="habit-form__button habit-form__button--secondary"
              >
                Cancel
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}
