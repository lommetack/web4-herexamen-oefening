import { Link } from "react-router";
import { gethabits } from "../services/habits";
import "./habits.css";

export function meta() {
  return [
    { title: "Manage Habits - Bad-habit-tracker" },
    { name: "description", content: "Add and update bad habits to track" },
  ];
}

export async function clientLoader() {
  const habits = await gethabits();
  return { habits };
}

export default function Habits({ loaderData }) {
  const { habits } = loaderData;

  return (
    <main className="habits-manager">
      <div className="habits-manager__container">
        <header className="habits-manager__header">
          <h1 className="habits-manager__title">Manage Bad Habits</h1>
          <Link to="/" className="habits-manager__link">
            Back to Tracker
          </Link>
        </header>

        <div className="habits-manager__content">
          <section className="habits-manager__section">
            <div className="habits-manager__section-header">
              <h2 className="habits-manager__section-title">Your Habits</h2>
              <Link to="/habits/new" className="habits-manager__add-button">
                Add New Habit
              </Link>
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
                      <Link
                        to={`/habits/${habit.id}`}
                        className="habits-list__button"
                      >
                        Edit
                      </Link>
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
