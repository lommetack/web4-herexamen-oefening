import { useState } from "react";
import "./App.css";
import Slider from "./components/Slider";
import Drawing from "./components/Drawing";

function App() {
  const [radius, setRadius] = useState(10);

  return (
    <div className="App">
      <Slider
        max={50}
        label="Radius"
        value={radius}
        onValueChange={(v) => setRadius(v)}
      />
      <Drawing radius={radius} />
    </div>
  );
}

export default App;
