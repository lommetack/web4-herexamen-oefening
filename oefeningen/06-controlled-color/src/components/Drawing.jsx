const Drawing = ({ radius, color }) => {
  const { red, green, blue } = color;

  return (
    <svg viewBox="0 0 100 100">
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
