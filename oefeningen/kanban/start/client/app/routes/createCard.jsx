import { useParams } from "react-router";
import CardForm from "../components/CardForm/CardForm";

const CreateCard = () => {
  const { laneId } = useParams();

  return (
    <>
      <h2 className="drawer__title">New card</h2>
      <CardForm isCreating={true} laneId={laneId} />
    </>
  );
};

export default CreateCard;
