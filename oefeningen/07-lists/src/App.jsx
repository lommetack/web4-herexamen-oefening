import { Bio } from "./Bio";
import Meals from "./Meals";

function App() {
  const bioData = {
    name: "Jeremy Robinson",
    birthPlace: "Laarne",
    birthYear: 1999,
  };

  const favouriteFood = [
    { name: "Pizza", emoji: "🍕" },
    { name: "Hamburger", emoji: "🍔" },
    { name: "Hotdog", emoji: "🌭" },
    { name: "Taco", emoji: "🌮" },
  ];

  const { name, birthPlace, birthYear } = bioData;

  return (
    <article>
      <h2>Hi, I am {name}</h2>
      <Bio birthPlace={birthPlace} birthYear={birthYear} />
      <Meals showEmoji={true} food={favouriteFood} />
    </article>
  );
}

export default App;
