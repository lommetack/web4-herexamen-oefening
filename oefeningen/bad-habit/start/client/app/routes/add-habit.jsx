import "./add-habit.css";

export function meta() {
  return [
    { title: "Add New Habit - Bad-habit-tracker" },
    { name: "description", content: "Add a new bad habit to track" },
  ];
}

export default function AddHabit() {
  return (
    <main className="add-habit">
      <div className="add-habit__container">
        <header className="add-habit__header">
          <h1 className="add-habit__title">Add New Habit</h1>
          <a href="/habits" className="add-habit__link">
            Back to Habits
          </a>
        </header>

        <div className="add-habit__content">
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
                required
                placeholder="Enter a name for your habit"
              />
            </div>

            <div className="habit-form__actions">
              <button
                type="submit"
                className="habit-form__button habit-form__button--primary"
              >
                Add Habit
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
