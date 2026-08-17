const Meal = ({ emoji, name }) => (
  <li className="meal">
    <span>{emoji}</span>
    <span>{name}</span>
  </li>
);

export const List = () => (
  <ul>
    <Meal emoji={"🍝"} name="Spaghetti" />
    <Meal emoji={"🍟"} name="French fries" />
    <Meal emoji={"🍗"} name="Roasted chicken" />
  </ul>
);

const Meals = () => (
  <section>
    <h3>My favourite meals</h3>
    <List />
  </section>
);

export default Meals;
