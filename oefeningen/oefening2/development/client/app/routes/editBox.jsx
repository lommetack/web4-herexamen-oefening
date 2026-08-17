import { useState } from "react";
import { Link, redirect, useLoaderData } from "react-router";
import BoxForm from "../components/BoxForm/BoxForm";
import BoxVisualizer from "../components/BoxVisualizer/BoxVisualizer";
import { getBoxById, updateBox } from "../services/boxService";
import "./editBox.css";

export const clientLoader = async ({ params }) => {
  const box = await getBoxById(params.id);
  return { box };
};

export const clientAction = async ({ request, params }) => {
  const formData = await request.formData();

  const box = {
    width: parseInt(formData.get("width"), 10),
    height: parseInt(formData.get("height"), 10),
    depth: parseInt(formData.get("depth"), 10),
    thickness: parseInt(formData.get("thickness"), 10),
    includeDragHandles: formData.get("includeDragHandles") === "on",
  };

  try {
    await updateBox(params.id, box);
    return redirect("/");
  } catch (error) {
    console.error("Error updating box:", error);
    return { error: error.message };
  }
};

const EditBoxPage = () => {
  const { box: loadedBox } = useLoaderData();
  const [box, setBox] = useState(loadedBox);

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
          <BoxForm box={box} setBox={setBox} />
        </div>

        <div className="edit-box-page__preview">
          <h2>Preview</h2>
          <div className="edit-box-page__visualizer">
            <BoxVisualizer box={box} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBoxPage;
