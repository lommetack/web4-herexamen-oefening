// Fetch error handler
const handleFetchError = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error: ${response.status}`);
  }
  return response.json();
};

/**
 * Fetch all boxes from the API.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of boxes.
 */
export const getAllBoxes = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/boxes`);
  return handleFetchError(response);
};

/**
 * Fetch a box by its ID from the API.
 * @param {string} id - The ID of the box to fetch.
 * @returns {Promise<Object>} - Returns a promise that resolves to the box object.
 */
export const getBoxById = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/boxes/${id}`
  );
  return handleFetchError(response);
};

/**
 * Add a new box to the API.
 * @param {Object} boxData - The data for the new box.
 * @returns {Promise<Object>} - Returns a promise that resolves to the created box object.
 */
export const addBox = async (boxData) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/boxes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...boxData,
      createdAt: new Date().toISOString(),
    }),
  });
  return handleFetchError(response);
};

/**
 * Update a box in the API.
 * @param {string} id - The ID of the box to update.
 * @param {Object} boxData - The updated data for the box.
 * @returns {Promise<Object>} - Returns a promise that resolves to the updated box object.
 */
export const updateBox = async (id, boxData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/boxes/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(boxData),
    }
  );
  return handleFetchError(response);
};
