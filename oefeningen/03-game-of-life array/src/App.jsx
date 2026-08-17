import { useState } from "react";
import "./App.css";
import { countSurrounding } from "./lib/utils";

function App() {
  const n = 30;
  const [checks, setChecks] = useState(new Array(n * n).fill(false));

  const handleClick = (index) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];

    setChecks(newChecks);
  };

  const handleLifeStep = () => {
    const newChecks = [...checks];

    for (let i = 0; i < n * n; i++) {
      const count = countSurrounding(n, checks, i);

      if (count < 2 || count > 3) {
        newChecks[i] = false;
      } else if (count === 3) {
        newChecks[i] = true;
      }
    }

    setChecks(newChecks);
  };

  return (
    <div className="App">
      <div className="grid" style={{ "--n": n }}>
        {checks.map((check, index) => (
          <input
            type="checkbox"
            key={index}
            onChange={() => handleClick(index)}
            checked={check}
          />
        ))}
      </div>
      <button onClick={handleLifeStep}>Life step</button>
    </div>
  );
}

export default App;
