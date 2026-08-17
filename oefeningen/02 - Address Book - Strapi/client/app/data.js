import qs from "qs";

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getContacts(query) {
  try {
    let filters;
    if (query) {
      filters = {
        $or: [
          {
            first: {
              $containsi: query,
            },
          },
          {
            last: {
              $containsi: query,
            },
          },
        ],
      };
    }
    const contacts = await fetchApi({
      endpoint: "contacts",
      wrappedByKey: "data",
      query: {
        sort: ["last", "createdAt"],
        filters,
      },
    });

    return contacts;
  } catch (error) {
    console.error("Error fetching random cats:", error);
    throw error;
  }
}

export async function createEmptyContact() {
  try {
    const contact = await fetchApi(
      {
        endpoint: `contacts`,
        wrappedByKey: "data",
      },
      {
        method: "POST",
        body: JSON.stringify({ data: {} }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return contact;
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
}

export async function getContact(id) {
  try {
    const contact = await fetchApi({
      endpoint: `contacts/${id}`,
      wrappedByKey: "data",
    });
    return contact;
  } catch (error) {
    console.error("Error fetching contact", error);
    throw error;
  }
}

export async function updateContact(id, updates) {
  try {
    const contact = await getContact(id);
    if (!contact) {
      throw "Not found";
    }

    const result = await fetchApi(
      {
        endpoint: `contacts/${id}`,
        wrappedByKey: "data",
      },
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: updates }),
      },
    );
    return result;
  } catch (error) {
    console.error("Error updating contact", error);
    throw error;
  }
}

export async function deleteContact(id) {
  try {
    const result = await fetchApi(
      { endpoint: `contacts/${id}`, wrappedByKey: "data" },
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return result;
  } catch (error) {
    console.error("Error deleting contact", error);
    throw error;
  }
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
const fetchApi = async (
  { endpoint, query = undefined, wrappedByKey, wrappedByList = undefined },
  options = {},
) => {
  try {
    if (endpoint.startsWith("/")) {
      endpoint = endpoint.slice(1);
    }

    const url = new URL(
      `${import.meta.env.VITE_API_BASE_URL}/api/${endpoint}${
        query ? `?${qs.stringify(query, { encode: false })}` : ``
      }`,
    );

    console.log("Fetching...", url.toString());

    const res = await fetch(url.toString(), options);
    if (res.status === 404) {
      return null;
    }
    if (res.status === 204) {
      return true;
    }
    let data = await res.json();

    if (wrappedByKey) {
      data = data[wrappedByKey];
    }

    if (wrappedByList) {
      data = data[0];
    }

    if (Array.isArray(data)) {
      return data.map(parseStrapiToDomain);
    }

    return parseStrapiToDomain(data);
  } catch (error) {
    console.error("Error fetching", error);
    throw error;
  }
};

const parseStrapiToDomain = (entity) => {
  entity.id = entity.documentId;
  delete entity.documentId;
  return entity;
};
