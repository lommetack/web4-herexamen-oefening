const Meal = ({ emoji, name, showEmoji }) => (
  <li className="meal">
    {showEmoji && <span>{emoji}</span>}
    <span>{name}</span>
  </li>
);

export const List = ({ showEmoji, food }) => (
  <ul>
    {food.map(({ emoji, name }) => (
      <Meal emoji={emoji} name={name} key={name} showEmoji={showEmoji} />
    ))}
  </ul>
);

const Meals = ({ showEmoji, food }) => (
  <section>
    <h3>My favourite meals</h3>
    <List showEmoji={showEmoji} food={food} />
  </section>
);

export default Meals;
