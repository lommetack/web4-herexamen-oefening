
const Drawing = ({ radius }) => {
  return (
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={radius} />
    </svg>
  );
};


export default Drawing;
