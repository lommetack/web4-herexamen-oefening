const Meal = ({ meal, onEaten }) => {
  return (
    <li className="meal">
      <span>{meal.emoji}</span>
      <span>{meal.name}</span>
      <button disabled={meal.nTimesEaten >= 10} onClick={onEaten}>
        {meal.nTimesEaten} time{meal.nTimesEaten === 1 ? "" : "s"} eaten
      </button>
    </li>
  );
};

export default Meal;
