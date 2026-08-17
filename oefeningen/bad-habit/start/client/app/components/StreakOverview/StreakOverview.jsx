import { calculateLongestStreaks } from "../../utils";
import "./StreakOverview.css";

const StreakOverview = ({ logs, habits }) => {
  const streaks = calculateLongestStreaks(logs, habits);

  const maxStreaks = Math.max(...streaks.map((streak) => streak.streakDays));

  return (
    <section className="streak-overview">
      <h2 className="streak-overview__title">Top Streaks</h2>
      <div className="streak-overview__cards">
        {streaks.map((streak) => (
          <div key={streak.habitId} className="streak-card">
            <div
              className="streak-card__indicator"
              style={{
                "--height": `${(streak.streakDays / maxStreaks) * 100}`,
              }}
            ></div>
            <div className="streak-card__content">
              <span className="streak-card__value">{streak.streakDays}</span>
              <span className="streak-card__label">
                day{streak.streakDays > 1 ? "s" : ""}
              </span>
            </div>
            <span className="streak-card__name">
              {
                habits.find(
                  (check) => parseInt(check.id) === parseInt(streak.habitId)
                ).name
              }
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StreakOverview;
