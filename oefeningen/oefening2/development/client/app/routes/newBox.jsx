import { useState } from "react";
import { Link, redirect } from "react-router";
import BoxForm from "../components/BoxForm/BoxForm";
import BoxVisualizer from "../components/BoxVisualizer/BoxVisualizer";
import { addBox } from "../services/boxService";
import { defaultBox } from "../utils";
import "./newBox.css";

export const clientAction = async ({ request }) => {
  const formData = await request.formData();

  const box = {
    width: parseInt(formData.get("width"), 10),
    height: parseInt(formData.get("height"), 10),
    depth: parseInt(formData.get("depth"), 10),
    thickness: parseInt(formData.get("thickness"), 10),
    includeDragHandles: formData.get("includeDragHandles") === "on",
  };

  try {
    await addBox(box);
    return redirect("/");
  } catch (error) {
    console.error("Error creating box:", error);
    return { error: error.message };
  }
};

const NewBox = () => {
  const [box, setBox] = useState(defaultBox);

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
          <BoxForm box={box} setBox={setBox} />
        </div>

        <div className="new-box__preview">
          <h2>Preview</h2>
          <div className="new-box__visualizer">
            <BoxVisualizer box={box} />
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
