import BoxVisualizer from "../BoxVisualizer/BoxVisualizer";
import "./BoxCard.css";

const BoxCard = ({box}) => {
  const { id, width, height, depth, thickness, includeDragHandles } = box;

  // Format dimensions string (width x height x depth)
  const dimensionsString = `${width}×${height}×${depth}`;

  return (
    <Link to={`/boxes/${id}`} className="box-card" id={`box-${id}`}>
      <div className="box-card__preview">
        <BoxVisualizer box={box} />
      </div>
      <div className="box-card__info">
        <h3 className="box-card__title">Box #{id}</h3>
        <p className="box-card__dimensions">{dimensionsString}</p>
        <p className="box-card__thickness">Thickness: {thickness}mm</p>
        {includeDragHandles && (
          <span className="box-card__badge">With Handles</span>
        )}
      </div>
    </Link>
  );
};

export default BoxCard;
