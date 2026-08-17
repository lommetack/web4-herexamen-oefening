import "./habits.css";

export function meta() {
  return [
    { title: "Manage Habits - Bad-habit-tracker" },
    { name: "description", content: "Add and update bad habits to track" },
  ];
}

export default function Habits() {
  const { habits } = { habits: [] };

  return (
    <main className="habits-manager">
      <div className="habits-manager__container">
        <header className="habits-manager__header">
          <h1 className="habits-manager__title">Manage Bad Habits</h1>
          <a href="/" className="habits-manager__link">
            Back to Tracker
          </a>
        </header>

        <div className="habits-manager__content">
          <section className="habits-manager__section">
            <div className="habits-manager__section-header">
              <h2 className="habits-manager__section-title">Your Habits</h2>
              <a href="/habits/new" className="habits-manager__add-button">
                Add New Habit
              </a>
            </div>

            <ul className="habits-list">
              {habits.length === 0 ? (
                <li className="habits-list__empty">
                  No habits added yet. Add your first habit to start tracking!
                </li>
              ) : (
                habits.map((habit) => (
                  <li key={habit.id} className="habits-list__item">
                    <div className="habits-list__content">
                      <h3 className="habits-list__name">{habit.name}</h3>
                    </div>
                    <div className="habits-list__actions">
                      <a
                        href={`/habits/${habit.id}`}
                        className="habits-list__button"
                      >
                        Edit
                      </a>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
