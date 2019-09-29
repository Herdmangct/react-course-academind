import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  // Only runs for the first rerender of this component
  // like componentDidMount
  useEffect(() => {
    fetch("https://hooks-01-starting-project.firebaseio.com/ingredients.json")
      .then(response => response.json)
      .then(responseData => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
        }
        setUserIngredients(loadedIngredients);
      });
    // need to have [] as the second argument because then this will run only once on the first render
    // i.e. will act similar to componentdidmount
  }, []);

  // cannot simply use fetch to get information from the server here because
  // it will run once the component is rendered. Then it will chnage the state
  // causing the component to rerender, thus creating an infinite loop

  const addIngredientHandler = ingredient => {
    fetch("https://hooks-01-starting-project.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      });
  };

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(previousIngredients =>
      previousIngredients.filter(ingredient => ingredient.id !== ingredientId)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
