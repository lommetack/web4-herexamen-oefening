import { Bio } from "./Bio";
import Meals from "./Meals";

function App() {
  const bioData = {
    name: "Jeremy Robinson",
    birthPlace: "Laarne",
    birthYear: 1999,
  };

  return (
    <article>
      <h2>Hi, I am {bioData.name}</h2>
      <Bio birthPlace={bioData.birthPlace} birthYear={bioData.birthYear} />
      <Meals />
    </article>
  );
}

export default App;
