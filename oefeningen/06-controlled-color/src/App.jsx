import { useState } from "react";
import "./App.css";
import Slider from "./components/Slider";
import Drawing from "./components/Drawing";

function App() {
  const [radius, setRadius] = useState(25);

  const [red, setRed] = useState(Math.floor(Math.random() * 256));
  const [green, setGreen] = useState(Math.floor(Math.random() * 256));
  const [blue, setBlue] = useState(Math.floor(Math.random() * 256));

  return (
    <div className="App">
      <Slider
        max={50}
        label="Radius"
        value={radius}
        onValueChange={(v) => setRadius(v)}
      />
      <Drawing radius={radius} color={{ red, green, blue }} />
      <Slider
        max={255}
        label="Red"
        value={red}
        onValueChange={(v) => setRed(v)}
      />
      <Slider
        max={255}
        label="Green"
        value={green}
        onValueChange={(v) => setGreen(v)}
      />
      <Slider
        max={255}
        label="Blue"
        value={blue}
        onValueChange={(v) => setBlue(v)}
      />
    </div>
  );
}

export default App;
