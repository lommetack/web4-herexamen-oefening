const fs = require("fs");

// Configuration
const STRAPI_URL = "http://localhost:1337/api"; // Change this to your Strapi URL
const CONTACTS_ENDPOINT = "/contacts";
const JSON_FILE_PATH = "../../01 - Address Book - JSON server/server/db.json";

// Function to read JSON file
function readContactsFile() {
  try {
    const data = fs.readFileSync(JSON_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts file:", error.message);
    process.exit(1);
  }
}

// Function to post a contact to Strapi
async function postContactToStrapi(contact) {
  try {
    // Remove the id field as we'll use Strapi's auto-generated ids
    const { id, createdAt, ...contactData } = contact;
    contactData.uid = contact.id;

    // Format data according to Strapi's structure
    const payload = {
      data: contactData,
    };

    const response = await fetch(`${STRAPI_URL}${CONTACTS_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    console.log(
      `Successfully posted contact: ${contact.first} ${contact.last}`
    );
    return data;
  } catch (error) {
    console.error(
      `Error posting contact ${contact.first} ${contact.last}:`,
      error.message
    );
    return null;
  }
}

// Main function to process all contacts
async function processContacts() {
  const { contacts } = readContactsFile();

  console.log(`Found ${contacts.length} contacts to process`);

  // Process contacts one by one
  for (const contact of contacts) {
    console.log(`Processing contact: ${contact.first} ${contact.last}`);
    await postContactToStrapi(contact);

    // Add a small delay to avoid overwhelming the API
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("All contacts have been processed");
}

// Run the script
processContacts().catch((error) => {
  console.error("An error occurred during execution:", error);
  process.exit(1);
});
