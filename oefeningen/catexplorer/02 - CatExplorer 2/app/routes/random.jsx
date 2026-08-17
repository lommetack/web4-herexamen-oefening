import CatCard from "../components/CatCard";
import { fetchRandomCats } from "../services/catApi";
import "./random.css";

export function shouldRevalidate() {
  return false;
}

export async function clientLoader() {
  return fetchRandomCats({ limit: 9 });
}

const RandomCats = ({ loaderData }) => {
  const cats = loaderData;

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
