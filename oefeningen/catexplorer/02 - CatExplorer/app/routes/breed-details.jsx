import CatCard from "../components/CatCard";
import "./breed-details.css";

// TODO: Implement clientLoader to fetch the breed Details, based on the route param.

const BreedDetails = () => {
  const images = [];
  const breed = {};

  if (!breed) {
    return <div className="error-container">Breed not found</div>;
  }

  return (
    <div className="breed-details-container container">
      <div className="breed-info">
        <h1>{breed.name}</h1>
        <p className="breed-description">{breed.description}</p>

        <div className="breed-stats">
          <div className="stat-item">
            <span className="stat-label">Origin:</span>
            <span className="stat-value">{breed.origin}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Temperament:</span>
            <span className="stat-value">{breed.temperament}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Life Span:</span>
            <span className="stat-value">{breed.life_span} years</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Weight:</span>
            <span className="stat-value">
              {breed.weight.metric} kg ({breed.weight.imperial} lbs)
            </span>
          </div>
        </div>

        {breed.wikipedia_url && (
          <a
            href={breed.wikipedia_url}
            target="_blank"
            rel="noopener noreferrer"
            className="wiki-link"
          >
            Learn more on Wikipedia
          </a>
        )}
      </div>

      <div className="breed-images">
        <h2>Gallery</h2>
        <div className="image-grid">
          {images.map((image) => (
            <CatCard key={image.id} cat={image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreedDetails;
