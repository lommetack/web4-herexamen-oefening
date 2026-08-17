import { getTodayDateString } from "../utils";

export const getLogs = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/logs?_sort=date&_order=desc`
    );

    if (!response.ok) throw new Error("Failed to fetch logs");

    return await response.json();
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};

export const getLogByDate = async (date) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/logs?date=${date}`
    );

    if (!response.ok) throw new Error("Failed to fetch log by date");

    return await response.json();
  } catch (error) {
    console.error("Error fetching log by date:", error);
    throw error;
  }
};

const updateLog = async (log) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/logs/${log.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          habits: log.habits,
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to update log");

    return await response.json();
  } catch (error) {
    console.error("Error updating log:", error);
    throw error;
  }
};

export const saveLog = async (log) => {
  try {
    log.habits = log.habits.map((habit) => parseInt(habit));
    if (!log.id) {
      log.date = getTodayDateString();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/logs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(log),
        }
      );

      if (!response.ok) throw new Error("Failed to post log");

      return await response.json();
    } else {
      return updateLog(log);
    }
  } catch (error) {
    console.error("Error posting log:", error);
    throw error;
  }
};
