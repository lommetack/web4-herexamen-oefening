import Meal from "./Meal";

const Meals = ({ showEmoji, food }) => (
  <section>
    <h3>My favourite meals</h3>
    <ul>
      {food.map(({ emoji, name }) => (
        <Meal emoji={emoji} name={name} key={name} showEmoji={showEmoji} />
      ))}
    </ul>
  </section>
);

export default Meals;
