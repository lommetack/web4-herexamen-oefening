import { Outlet } from "react-router";
import Board from "../components/Board/Board.jsx";

import "./home.css";

export default function Home({ loaderData }) {
  const { lanes } = loaderData;

  const handleCardMove = async (cardId, sourceLaneId, targetLaneId) => {
    if (sourceLaneId === targetLaneId) return;
  };

  return (
    <main className="home">
      <div className="home__header">
        <h1 className="home__title">Kanban Board</h1>
      </div>
      <Board lanes={lanes} onCardMove={handleCardMove} />
      <Outlet />
    </main>
  );
}
