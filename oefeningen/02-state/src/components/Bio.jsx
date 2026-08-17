import { useState } from "react";

export const Bio = ({ birthYear, birthPlace }) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const colors = ["paleturquoise", "lightpink", "lightgreen", "lightyellow"];

  const handleClick = () => {
    const nextColorIndex = (currentColorIndex + 1) % colors.length;
    setCurrentColorIndex(nextColorIndex);
  };

  return (
    <p
      onClick={handleClick}
      style={{
        color: "darkgrey",
        backgroundColor: colors[currentColorIndex],
        fontWeight: "bold",
        padding: "0.3rem",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      I was born in {birthYear} ({birthPlace})
    </p>
  );
};
