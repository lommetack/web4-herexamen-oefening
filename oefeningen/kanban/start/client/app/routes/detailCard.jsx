import { getPriority } from "../utils";
import "./detailCard.css";

const DetailCard = ({ loaderData }) => {
  const { card } = loaderData;

  const currentPriority = getPriority(card.priority);

  return (
    <>
      <h2 className="drawer__title">{card.title}</h2>

      <div className="drawer__body">
        <p>{card.description}</p>

        <dl>
          <dt>Priority</dt>
          <dd>
            <div className="priority-display">
              <div
                className="priority-color-indicator"
                style={{ backgroundColor: currentPriority.color }}
              ></div>
              <span>{currentPriority.name}</span>
            </div>
          </dd>
        </dl>

        <div className="edit-link-container bottom-drawer-action">
          <a href={`/${card.id}/edit`} className="edit-link">
            Edit Card
          </a>
        </div>
      </div>
    </>
  );
};

export default DetailCard;
