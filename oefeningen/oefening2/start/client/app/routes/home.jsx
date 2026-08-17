import BoxCard from "../components/BoxCard/BoxCard";
import "./home.css";
import {Link} from "react-router";

const HomePage = ({box}) => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Box Configurator</h1>
        <Link to="/boxes/new" className="button button-primary">
          Create New Box
        </Link>
      </header>

      <div className="box-grid">
        {box.map((box) => (
          <BoxCard key={box.id} box={box} />
        ))}
      </div>
    </div>
  );
};

const EmptyState = () => {
  <div className="empty-state">
    <p>You haven't created any boxes yet.</p>
    <Link to="/boxes/new" className="button button-secondary">
      Create Your First Box
    </Link>
  </div >
}

export default HomePage;
