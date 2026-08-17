import BoxForm from "../components/BoxForm/BoxForm";
import BoxVisualizer from "../components/BoxVisualizer/BoxVisualizer";
import "./newBox.css";
import { formData } from "../components/BoxForm";
import { Link } from "react-router";
import { addBox } from "../services/boxService";
import { box } from "react-router";


export const clientAction = async ({ request, box }) => {
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

const NewBox = () => {
  return (
    <div className="new-box">
      <header className="new-box__header">
        <h1>Create New Box</h1>
        <Link to="/" className="button button-secondary">
          Cancel
        </Link>
      </header>

      <div className="new-box__content">
        <div className="new-box__form-container">
          <BoxForm />
        </div>

        <div className="new-box__preview">
          <h2>Preview</h2>
          <div className="new-box__visualizer">
            <BoxVisualizer />
          </div>

          <div className="dimensions-display">
            <p>Width: {box.width}mm</p>
            <p>Height: {box.height}mm</p>
            <p>Depth: {box.depth}mm</p>
            <p>Thickness: {box.thickness}mm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBox;