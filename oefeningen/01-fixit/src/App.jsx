import { useState } from "react";
import Meal from "./components/Meal";

function App() {
  const [isVisible, setIsVisible] = useState(true);

  const [meals, setMeals] = useState([
    { id: 1, name: "Pizza", emoji: "🍕", nTimesEaten: 0 },
    { id: 2, name: "Hamburger", emoji: "🍔", nTimesEaten: 0 },
    { id: 3, name: "Hotdog", emoji: "🌭", nTimesEaten: 0 },
    { id: 4, name: "Taco", emoji: "🌮", nTimesEaten: 0 },
  ]);

  const handleMealEaten = (id) => {
    // Creating a copy of the array first, then creating a copy of the object
    /*  
    const tmpMeals = [...meals];
    const mealIndex = tmpMeals.findIndex((check) => check.id === id);
    const tmpMeal = { ...tmpMeals[mealIndex] };
    tmpMeal.nTimesEaten++;
    tmpMeals[mealIndex] = tmpMeal;
    setMeals(tmpMeals); */

    // Map returns a copy of te array, if the id of the meal matches: return a new object with the updated value.
    setMeals(
      meals.map((meal) =>
        meal.id === id ? { ...meal, nTimesEaten: meal.nTimesEaten + 1 } : meal
      )
    );

    // structuredClone is also a valid option
    /*
    const tmpMeals = structuredClone(meals);
    tmpMeals.find((check) => check.id === id).nTimesEaten++;
    setMeals(tmpMeals);
    */

    /* Although the following code -visually- works, the objects in the tmp array still have te same reference to the original array. 
      We would still be mutating the state directly
      const tmpMeals = [...meals];
      const meal = tmpMeals.find((check) => check.id === id);
      meal.nTimesEaten++;
      setMeals(tmpMeals);
    */
  };

  const handleClickButton = () => {
    setIsVisible(!isVisible);
  };

  return (
    <article>
      <h3>My favourite meals</h3>
      <button onClick={handleClickButton}>{isVisible ? "Hide" : "Show"}</button>
      {isVisible && (
        <ul>
          {meals.map((meal) => (
            <Meal
              meal={meal}
              key={meal.id}
              onEaten={() => handleMealEaten(meal.id)}
            />
          ))}
        </ul>
      )}
    </article>
  );
}

export default App;
