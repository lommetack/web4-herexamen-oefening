import BoxForm from "../components/BoxForm/BoxForm"; // Import the new component
import BoxVisualizer from "../components/BoxVisualizer/BoxVisualizer";
import "./editBox.css";
import { Link } from "react-router";
import { box } from "react-router";

export const clientAction = async ({ request, params, formData }) => {
  
  const box = {
    width: parseInt(formData.get("width"), 10),
    height: parseInt(formData.get("height"), 10),
    depth: parseInt(formData.get("depth"), 10),
    thickness: parseInt(formData.get("thickness"), 10),
    includeDragHandles: formData.get("includeDragHandles") === "on",
  };

  try {
    // ...
  } catch (error) {
    console.error("Error creating box:", error);
    return { error: error.message };
  }
};

const EditBoxPage = () => {

  return (
    <div className="edit-box-page">
      <header className="edit-box-page__header">
        <h1>Edit Box #{box.id}</h1>
        <Link to={`/boxes/${box.id}`} className="button button-secondary">
          Cancel
        </Link>
      </header>

      <div className="edit-box-page__content">
        <div className="edit-box-page__form-container">
          <BoxForm/>
        </div>

        <div className="edit-box-page__preview">
          <h2>Preview</h2>
          <div className="edit-box-page__visualizer">
            <BoxVisualizer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBoxPage;
