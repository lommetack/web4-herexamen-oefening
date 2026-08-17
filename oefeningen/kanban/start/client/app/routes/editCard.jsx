import CardForm from "../components/CardForm/CardForm";
import "./detailCard.css";

const EditCard = ({ loaderData }) => {
  const { card } = loaderData;

  return (
    <>
      <h2 className="drawer__title">Edit card</h2>
      <CardForm isCreating={false} card={card} />
    </>
  );
};

export default EditCard;
