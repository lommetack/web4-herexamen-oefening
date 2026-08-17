const Meal = ({ emoji, name, showEmoji }) => (
  <li className="meal">
    {showEmoji ? <span>{emoji}</span> : null}
    {/*  {showEmoji && <span>{emoji}</span>} */}
    <span>{name}</span>
  </li>
);

export const List = ({ showEmoji }) => (
  <ul>
    <Meal emoji={"🍝"} name="Spaghetti" showEmoji={showEmoji} />
    <Meal emoji={"🍟"} name="French fries" showEmoji={showEmoji} />
    <Meal emoji={"🍗"} name="Roasted chicken" showEmoji={showEmoji} />
  </ul>
);

const Meals = ({ showEmoji }) => (
  <section>
    <h3>My favourite meals</h3>
    <List showEmoji={showEmoji} />
  </section>
);

export default Meals;
