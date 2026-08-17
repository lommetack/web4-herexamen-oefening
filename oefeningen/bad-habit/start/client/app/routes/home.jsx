import HabitList from "../components/HabitList/HabitList";
import PreviousDays from "../components/PreviousDays/PreviousDays";
import StreakOverview from "../components/StreakOverview/StreakOverview";

import "./home.css";

export function meta() {
  return [
    { title: "Bad-habit-tracker" },
    { name: "description", content: "Logging bad habits" },
  ];
}

export default function Home() {
  const { habits, logs } = { habits: [], logs: [] };

  return (
    <main className="habit-tracker">
      <div className="habit-tracker__container">
        <header className="habit-tracker__header">
          <h1 className="habit-tracker__title">Bad Habit Tracker</h1>
          <a href="/habits" className="habit-tracker__manage-link">
            Manage Habits
          </a>
        </header>

        <StreakOverview logs={logs} habits={habits} />

        <div className="habit-tracker__content">
          <section className="habit-tracker__today">
            <h2 className="habit-tracker__section-title">Today's Check-in</h2>
            <HabitList habits={habits} logs={logs} />
          </section>

          <section className="habit-tracker__history">
            <h2 className="habit-tracker__section-title">Previous Days</h2>
            <PreviousDays logs={logs} habits={habits} />
          </section>
        </div>
      </div>
    </main>
  );
}
