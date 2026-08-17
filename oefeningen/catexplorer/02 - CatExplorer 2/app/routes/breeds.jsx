import { useState } from "react";
import { Link } from "react-router";
import { fetchBreeds } from "../services/catApi";
import "./breeds.css";

export async function clientLoader() {
  const data = await fetchBreeds();
  return data;
}

const CatBreeds = ({ loaderData }) => {
  const breeds = loaderData;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBreeds = breeds.filter((breed) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      breed.name.toLowerCase().includes(searchLower) ||
      (breed.origin && breed.origin.toLowerCase().includes(searchLower)) ||
      breed.temperament.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="breeds-container container">
      <h1>Cat Breed Directory</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search breeds by name, origin, or temperament..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="breeds-list">
        {filteredBreeds.length === 0 ? (
          <p className="no-results">No breeds found matching your search.</p>
        ) : (
          filteredBreeds.map((breed) => (
            <Link
              to={`/breeds/${breed.id}`}
              key={breed.id}
              className="breed-card"
            >
              <h2>{breed.name}</h2>
              <p>
                <strong>Origin:</strong> {breed.origin}
              </p>
              <p>
                <strong>Temperament:</strong> {breed.temperament}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CatBreeds;
