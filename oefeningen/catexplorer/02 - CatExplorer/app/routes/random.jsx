import CatCard from "../components/CatCard";
import "./random.css";

// TODO: Implement clientLoader to fetch 9 random cats.

// TODO: Implement shouldRevalidate

const RandomCats = () => {
  const cats = [];

  return (
    <div className="random-cats-container container">
      <div className="random-cats-header">
        <h1>Random Cats</h1>
      </div>

      <div className="cat-grid">
        {cats.map((cat) => (
          <CatCard key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
};

export default RandomCats;
