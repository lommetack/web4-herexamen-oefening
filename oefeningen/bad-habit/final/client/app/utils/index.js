export const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

/**
 * Core streak calculation function that handles common logic
 * @param {Array} logs - Array of log entries containing habits and dates
 * @param {Array} habits - Array of habit objects with id and name
 * @param {boolean} includeHistorical - Whether to track the longest historical streak
 * @param {boolean} onlyActive - Whether to only return active streaks (today/yesterday)
 * @returns {Object} - Mapping of habit IDs to streak information
 */
const calculateStreaks = (
  logs,
  habits,
  includeHistorical = false,
  onlyActive = false
) => {
  if (!logs || !logs.length) return {};

  // Get today and yesterday dates for comparison if needed
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Create a map of habit IDs to track streaks
  const habitStreaks = {};

  // Initialize streak data for each habit
  habits.forEach((habit) => {
    habitStreaks[habit.id] = {
      currentStreak: 0,
      ...(includeHistorical && { longestStreak: 0 }),
      lastDate: null,
    };
  });

  // Sort logs by date (ascending)
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Process each log chronologically
  sortedLogs.forEach((log) => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    // Process all habits
    habits.forEach((habit) => {
      const habitId = habit.id;
      const habitData = habitStreaks[habitId];
      const isHabitLogged = log.habits.includes(habitId);

      // If habit is logged on this day
      if (isHabitLogged) {
        // If this is the first occurrence or there was a previous date
        if (!habitData.lastDate) {
          habitData.currentStreak = 1;
        } else {
          // Check if this is the next consecutive day
          const lastDate = new Date(habitData.lastDate);
          lastDate.setHours(0, 0, 0, 0);

          const dayDifference = Math.floor(
            (logDate - lastDate) / (1000 * 60 * 60 * 24)
          );

          if (dayDifference === 1) {
            // Consecutive day, increase streak
            habitData.currentStreak++;
          } else if (dayDifference > 1) {
            // Break in streak, reset counter
            habitData.currentStreak = 1;
          }
        }

        // Update lastDate to current log date
        habitData.lastDate = log.date;

        // Update longest streak if tracking historical data
        if (
          includeHistorical &&
          habitData.currentStreak > habitData.longestStreak
        ) {
          habitData.longestStreak = habitData.currentStreak;
        }
      }
    });
  });

  // If only active streaks are needed, filter out non-active streaks
  if (onlyActive) {
    Object.keys(habitStreaks).forEach((habitId) => {
      const habitData = habitStreaks[habitId];
      if (habitData.lastDate) {
        const lastLogDate = new Date(habitData.lastDate);
        lastLogDate.setHours(0, 0, 0, 0);

        const isCurrentStreak =
          lastLogDate.getTime() === today.getTime() ||
          lastLogDate.getTime() === yesterday.getTime();

        if (!isCurrentStreak) {
          habitData.currentStreak = 0;
        }
      }
    });
  }

  return habitStreaks;
};

/**
 * Calculates the top 5 longest streaks for habits from log data
 * @param {Array} logs - Array of log entries containing habits and dates
 * @param {Array} habits - Array of habit objects with id and name
 * @returns {Object} - Object with habit IDs as keys and longest streak as values, containing only the top 5
 */
export const calculateLongestStreaks = (logs, habits) => {
  if (!logs || !logs.length) return [];

  // Get streak data with historical tracking
  const habitStreaks = calculateStreaks(logs, habits, true, false);

  // Create array of habit streaks
  const streaksArray = Object.keys(habitStreaks).map((habitId) => ({
    habitId,
    streakDays: habitStreaks[habitId].longestStreak,
  }));

  // Sort by streak length (descending) and take top 5
  const top5Streaks = streaksArray
    .sort((a, b) => b.streakDays - a.streakDays)
    .slice(0, 5);

  return top5Streaks;
};

/**
 * Calculates the current active streaks for habits from log data
 * @param {Array} logs - Array of log entries containing habits and dates
 * @param {Array} habits - Array of habit objects with id and name
 * @returns {Array} - Array of objects with habitId and current streak days, sorted by streak length (descending)
 */
export const calculateCurrentStreaks = (logs, habits) => {
  if (!logs || !logs.length) return [];

  // First, check if there are any active logs (from today or yesterday)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Sort logs by date (descending - most recent first)
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Check if the most recent log is from today or yesterday
  const mostRecentLog = sortedLogs[0];
  if (!mostRecentLog) return [];

  const mostRecentDate = new Date(mostRecentLog.date);
  mostRecentDate.setHours(0, 0, 0, 0);

  const isStreakActive =
    mostRecentDate.getTime() === today.getTime() ||
    mostRecentDate.getTime() === yesterday.getTime();

  // If no active streak (most recent log is older than yesterday), return empty result
  if (!isStreakActive) return [];

  // Get streak data with active streak filtering
  const habitStreaks = calculateStreaks(logs, habits, false, true);

  // Create array of objects with habitId and streakDays
  const streaksArray = Object.keys(habitStreaks)
    .filter((habitId) => habitStreaks[habitId].currentStreak > 0)
    .map((habitId) => ({
      habitId,
      streakDays: habitStreaks[habitId].currentStreak,
    }));

  return streaksArray;
};
