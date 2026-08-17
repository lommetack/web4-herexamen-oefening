import { useState } from "react";

const Meal = ({ emoji, name, showEmoji }) => {
  const [nTimesEaten, setNTimesEaten] = useState(0);

  return (
    <li className="meal">
      {showEmoji && <span>{emoji}</span>}
      <span>{name}</span>
      <button
        disabled={nTimesEaten >= 10}
        onClick={() => setNTimesEaten(nTimesEaten + 1)}
      >
        {nTimesEaten} time{nTimesEaten === 1 ? "" : "s"} eaten
      </button>
    </li>
  );
};

export default Meal;
