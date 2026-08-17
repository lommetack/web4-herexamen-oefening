const Meal = (props) => (
  <li className="meal">
    <span>{props.emoji}</span>
    <span>{props.name}</span>
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
