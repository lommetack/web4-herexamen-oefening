import { useState } from "react";
import "./App.css";
import Slider from "./components/Slider";
import Drawing from "./components/Drawing";

function App() {
  const [style, setStyle] = useState({
    radius: 25,
    red: 10,
    green: 100,
    blue: 150,
  });

  const handleRadiusChange = (radius) => {
    /*
      const tmp = { ...style };
      tmp.radius = value;
      setStyle(tmp);
    */

    // Shorthand property names
    setStyle({ ...style, radius });
  };

  const handleChannelChange = (channel, value) => {
    /*
      const tmp = { ...style };
      tmp[channel] = value;
      setStyle(tmp);
    */

    // Computed property names
    setStyle({ ...style, [channel]: value });
  };

  const { radius, red, green, blue } = style;

  return (
    <div className="App">
      <Slider
        max={50}
        label="Radius"
        value={radius}
        onValueChange={(v) => handleRadiusChange(v)}
      />
      <Drawing radius={radius} color={{ red, green, blue }} />
      <Slider
        max={255}
        label="Red"
        value={red}
        onValueChange={(v) => handleChannelChange("red", v)}
      />
      <Slider
        max={255}
        label="Green"
        value={green}
        onValueChange={(v) => handleChannelChange("green", v)}
      />
      <Slider
        max={255}
        label="Blue"
        value={blue}
        onValueChange={(v) => handleChannelChange("blue", v)}
      />
    </div>
  );
}

export default App;
