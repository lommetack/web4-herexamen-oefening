import { calculateCurrentStreaks, getTodayDateString } from "../../utils";
import "./HabitList.css";
import { useFetcher } from "react-router";

const HabitList = ({ habits, logs }) => {
  let fetcher = useFetcher();

  const onToggleHabit = (e) => {
    fetcher.submit(e.target.form);
  };

  const today = getTodayDateString();
  const current = logs.find((check) => check.date === today);
  const streaks = calculateCurrentStreaks(logs, habits);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="id" defaultValue={current?.id} />
      {habits.length === 0 ? (
        <p>No bad habits defined</p>
      ) : (
        <ul className="habit-list">
          {habits.map((habit) => {
            const streakDays =
              streaks.find(
                (check) => parseInt(check.habitId) === parseInt(habit.id)
              )?.streakDays || 0;
            return (
              <li key={`${today}-${habit.id}`} className="habit-list__item">
                <label className="habit-list__label">
                  <div className="habit-list__content">
                    <span className="habit-list__name">{habit.name}</span>
                    <span className="habit-list__streak">
                      {streakDays} day{streakDays !== 1 ? "s" : ""} streak
                    </span>
                  </div>
                  <div className="habit-list__checkbox">
                    <input
                      type="checkbox"
                      defaultChecked={current?.habits.includes(habit.id)}
                      onChange={onToggleHabit}
                      className="habit-list__input"
                      name={`habit`}
                      value={habit.id}
                    />
                    <span className="habit-list__checkmark"></span>
                  </div>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </fetcher.Form>
  );
};

export default HabitList;
