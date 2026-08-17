import { Link, useLoaderData } from "react-router";
import BoxCard from "../components/BoxCard/BoxCard";
import { getAllBoxes } from "../services/boxService";
import "./home.css";

export const clientLoader = async () => {
  const boxes = await getAllBoxes();
  return { boxes };
};

const EmptyState = () => {
  return (
    <div className="empty-state">
      <p>You haven&apos;t created any boxes yet.</p>
      <Link to="/boxes/new" className="button button-secondary">
        Create Your First Box
      </Link>
    </div>
  );
};

const HomePage = () => {
  const { boxes } = useLoaderData();

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Box Configurator</h1>
        <Link to="/boxes/new" className="button button-primary">
          Create New Box
        </Link>
      </header>

      {boxes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="box-grid">
          {boxes.map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
