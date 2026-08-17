export const gethabits = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/habits`);

    if (!response.ok) throw new Error("Failed to fetch habits");

    return await response.json();
  } catch (error) {
    console.error("Error fetching habits:", error);
    throw error;
  }
};

export const addHabit = async (habit) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/habits`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(habit),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch habits");

    return await response.json();
  } catch (error) {
    console.error("Error fetching habits:", error);
    throw error;
  }
};

export const updateHabit = async (updatedHabit) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/habits/${updatedHabit.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedHabit.name }),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch habits");

    return await response.json();
  } catch (error) {
    console.error("Error fetching habits:", error);
    throw error;
  }
};

export const getHabitById = async (id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/habits/${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch habit");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching habit:", error);
    return null;
  }
};
