import "./edit-habit.css";

export function meta() {
  return [
    { title: "Edit Habit - Bad-habit-tracker" },
    { name: "description", content: "Edit a bad habit" },
  ];
}

export default function EditHabit() {
  const { habit } = { habit: { name: "dummy" } };

  if (!habit) {
    return (
      <main className="edit-habit">
        <div className="edit-habit__container">
          <h1 className="edit-habit__title">Habit not found</h1>
          <a href="/habits" className="edit-habit__link">
            Back to Habits
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="edit-habit">
      <div className="edit-habit__container">
        <header className="edit-habit__header">
          <h1 className="edit-habit__title">Edit Habit</h1>
          <a href="/habits" className="edit-habit__link">
            Back to Habits
          </a>
        </header>

        <div className="edit-habit__content">
          <form method="post" className="habit-form">
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
              <a
                href="/habits"
                className="habit-form__button habit-form__button--secondary"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
