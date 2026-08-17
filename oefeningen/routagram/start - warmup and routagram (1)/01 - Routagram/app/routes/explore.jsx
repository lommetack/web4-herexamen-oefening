// React Aria imports
import { SearchField } from "react-aria-components";

export const clientLoader = async () => {
  // Generate array of image IDs for the explore page
  const imageIds = Array.from({ length: 12 }, (_, i) => 100 + i);
  return { imageIds };
};

export default function Explore() {
  const imageIds = [];

  return (
    <div className="explore-page">
      <div className="search-container">
        <SearchField className="search-field" aria-label="Search content">
          {({ inputProps }) => (
            <>
              <input
                {...inputProps}
                className="search-input"
                placeholder="Search"
              />
            </>
          )}
        </SearchField>
      </div>

      <div className="explore-grid">
        {imageIds.map((id) => (
          <div key={id} className="explore-item">
            <img
              src={`https://picsum.photos/seed/${id}/300/300`}
              alt={`Explore ${id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
