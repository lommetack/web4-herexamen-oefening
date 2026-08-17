import { Form } from "react-router";
import "./BoxForm.css";

const BoxForm = () => {
  const handleBoxValueChange = (key, e) => {
    const value =
      key === "includeDragHandles"
        ? e.target.checked
        : parseInt(e.target.value, 10);

    setBox((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle shift+arrow keys for increment/decrement by 10
  const handleKeyDown = (dimension, e) => {
    if (e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();

      const currentValue = box[dimension];
      let newValue = currentValue;

      if (e.key === "ArrowUp") {
        newValue = currentValue + 10;
      } else if (e.key === "ArrowDown") {
        newValue = Math.max(10, currentValue - 10);
      }

      setBox((prev) => ({
        ...prev,
        [dimension]: newValue,
      }));
    }
  };

  const isDepthSufficient = box.depth >= 150;

  return (
    <Form className="box-form" method="post">
      <div className="form-group form-group--dimension">
        <label htmlFor="widthInput">Width (mm)</label>
        <input
          type="number"
          id="widthInput"
          name="width"
          className="form-control"
          onChange={(e) => handleBoxValueChange("width", e)}
          onKeyDown={(e) => handleKeyDown("width", e)}
          min="10"
          max="1000"
          required
        />
      </div>

      <div className="form-group form-group--dimension">
        <label htmlFor="heightInput">Height (mm)</label>
        <input
          type="number"
          id="heightInput"
          name="height"
          className="form-control"
          onChange={(e) => handleBoxValueChange("height", e)}
          onKeyDown={(e) => handleKeyDown("height", e)}
          min="10"
          max="1000"
          required
        />
      </div>

      <div className="form-group form-group--dimension">
        <label htmlFor="depthInput">Depth (mm)</label>
        <input
          type="number"
          id="depthInput"
          name="depth"
          className="form-control"
          onChange={(e) => handleBoxValueChange("depth", e)}
          onKeyDown={(e) => handleKeyDown("depth", e)}
          min="10"
          max="1000"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="thicknessSelect">Thickness (mm)</label>
        <select
          id="thicknessSelect"
          name="thickness"
          className="form-control"
          onChange={(e) => handleBoxValueChange("thickness", e)}
          required
        >
          {[...Array(8)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1} mm
            </option>
          ))}
        </select>
      </div>

      <div className="form-group form-group--checkbox">
        <input
          type="checkbox"
          id="dragHandlesToggle"
          name="includeDragHandles"
          className="checkbox-control"
          onChange={(e) => handleBoxValueChange("includeDragHandles", e)}
        />
        <label
          htmlFor="dragHandlesToggle"
          className={"checkbox-label--disabled"}
        >
          Include drag handles
        </label>
      
         {/*  <span className="checkbox-hint">
            Depth must be at least 150mm for drag handles
          </span> */}
   
      </div>

      <div className="form-actions">
        {box.id ? (
          <>
            <button
              type="submit"
              className="button button-primary"
            >
              Save box
            </button>
            <button
              type="submit"
              className="button button-success"
            >
              Save as new
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="button button-primary"
          >
            Create new box
          </button>
        )}
      </div>
    </Form>
  );
};

export default BoxForm;
