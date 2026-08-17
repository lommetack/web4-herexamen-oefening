import "./Drawing.css";

const Drawing = ({ radius, color }) => {
  const { red, green, blue } = color;

  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill={`rgb(${red}, ${green}, ${blue})`}
      />
    </svg>
  );
};

export default Drawing;
