import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

const createContact = (values) => {
  const id = values.id || Math.random().toString(36).substring(2, 9);
  const createdAt = new Date().toISOString();
  const newContact = { id, createdAt, ...values };
  return newContact;
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getContacts(query) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/contacts`,
    );

    if (!response.ok) throw new Error("Failed to fetch cats");

    // no search functionality with json server, so we have to do it here...
    let contacts = await response.json();
    if (query) {
      contacts = matchSorter(contacts, query, {
        keys: ["first", "last"],
      });
    }
    return contacts.sort(sortBy("last", "createdAt"));
  } catch (error) {
    console.error("Error fetching random cats:", error);
    throw error;
  }
}

export async function createEmptyContact() {
  try {
    const contact = createContact({});

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      },
    );
    if (!response.ok) throw new Error("Failed to add contact");
    return await response.json();
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
}

export async function getContact(id) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/contacts/${id}`,
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching contact", error);
    throw error;
  }
}

export async function updateContact(id, updates) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/contacts/${id}`,
    );

    if (!response.ok) throw new Error("Failed to fetch contact");
    const contact = response.json();

    const updatedContact = { ...contact, ...updates };

    const updateResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/contacts/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContact),
      },
    );
    return await updateResponse.json();
  } catch (error) {
    console.error("Error updating contact", error);
    throw error;
  }
}

export async function deleteContact(id) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/contacts/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Error deleting contact", error);
    throw error;
  }
}
