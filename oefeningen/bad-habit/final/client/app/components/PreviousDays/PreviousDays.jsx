import { getTodayDateString } from "../../utils";
import "./PreviousDays.css";

const PreviousDays = ({ logs, habits }) => {
  const today = getTodayDateString();

  const filteredLogs = logs.filter((log) => log.date !== today);

  console.log("Filtered logs:", filteredLogs);
  return (
    <div className="previous-days">
      {filteredLogs.length === 0 ? (
        <p>No days logged yet, go ahead and track some habits</p>
      ) : (
        filteredLogs.map((log) => (
          <div key={log.id} className="previous-days__item">
            <div className="previous-days__date">{log.date}</div>
            <div className="previous-days__habits">
              {habits.map((habit) => (
                <div
                  key={`${log.id}-${habit.id}`}
                  className={`previous-days__habit ${
                    log.habits.includes(habit.id)
                      ? "previous-days__habit--checked"
                      : ""
                  }`}
                >
                  <span className="previous-days__habit-name">
                    {habit.name}
                  </span>
                  <span className="previous-days__habit-icon">
                    {log.habits.includes(habit.id) ? "✓" : "×"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PreviousDays;
