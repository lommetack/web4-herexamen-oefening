import { Link, useLoaderData } from "react-router";
import BoxVisualizer from "../components/BoxVisualizer/BoxVisualizer";
import { getBoxById } from "../services/boxService";
import "./detailBox.css";

export const clientLoader = async ({ params }) => {
  const box = await getBoxById(params.id);
  return { box };
};

const DetailBoxPage = () => {
  const { box } = useLoaderData();

  const formattedDate = box.createdAt
    ? new Date(box.createdAt).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "-";

  return (
    <div className="box-detail">
      <header className="box-detail__header">
        <h1>Box #{box.id}</h1>
        <div className="box-detail__actions">
          <Link to={`/boxes/edit/${box.id}`} className="button button-primary">
            Edit Box
          </Link>
          <Link to="/" className="button button-secondary">
            Back to List
          </Link>
        </div>
      </header>

      <div className="box-detail__content">
        <div className="box-detail__visualization">
          <BoxVisualizer box={box} />
        </div>

        <div className="box-detail__info">
          <h2>Box Specifications</h2>

          <dl className="box-detail__specs">
            <div>
              <dt>Dimensions (W×H×D):</dt>
              <dd>
                {box.width}×{box.height}×{box.depth} mm
              </dd>
            </div>
            <div>
              <dt>Thickness:</dt>
              <dd>{box.thickness} mm</dd>
            </div>
            <div>
              <dt>Drag Handles:</dt>
              <dd>{box.includeDragHandles ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt>Created at:</dt>
              <dd>{formattedDate}</dd>
            </div>
          </dl>

          <div className="box-detail__calculations">
            <h3>Calculations</h3>
            <p>
              <strong>Volume:</strong>{" "}
              {(box.width * box.height * box.depth) / 1000000} liters
            </p>
            <p>
              <strong>Surface Area:</strong>{" "}
              {(2 *
                (box.width * box.height +
                  box.width * box.depth +
                  box.height * box.depth)) /
                10000}{" "}
              m²
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBoxPage;
