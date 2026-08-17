import { Bio } from "./Bio";
import Meals from "./Meals";

function App() {
  const name = "Jeremy Robinson";
  return (
    <article>
      <h2>Hi, I am {name}</h2>
      <Bio />
      <Meals />
    </article>
  );
}

export default App;
