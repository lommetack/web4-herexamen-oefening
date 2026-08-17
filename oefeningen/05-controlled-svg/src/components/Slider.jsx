
import "./Slider.css";

const Slider = ({ onValueChange, value, max, min = 0, label }) => {
  return (
    <label>
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onValueChange(parseInt(e.target.value, 10))}
      />
      <span>{value}</span>
    </label>
  );
};

export default Slider;
