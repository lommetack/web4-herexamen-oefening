import { getPriority } from "../../utils";
import "./Card.css";

const Card = ({ card }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("cardId", card.id);
    e.dataTransfer.effectAllowed = "move";

    // Add a class to the element being dragged
    e.currentTarget.classList.add("task-card--dragging");
  };

  const handleDragEnd = (e) => {
    // Remove dragging class when done
    e.currentTarget.classList.remove("task-card--dragging");
  };

  const handleClick = (e) => {
    // Only navigate if we're not dragging
    if (e.currentTarget.classList.contains("task-card--dragging")) {
      e.preventDefault();
    }
  };

  const priority = getPriority(card.priority);

  return (
    <a
      href={`${card.id}`}
      className="task-card"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      viewTransition
      style={{ "--color-priority": priority.color }}
    >
      <article className="task-card__content">
        <h3 className="task-card__title">{card.title}</h3>
        <p className="task-card__description">{card.description}</p>
      </article>
    </a>
  );
};

export default Card;
