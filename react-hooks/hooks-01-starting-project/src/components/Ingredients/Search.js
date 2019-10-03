import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  // this establishes a reference to the input value. Thus can get value
  // currently in input
  const inputRef = useRef();

  useEffect(() => {
    if (enteredFilter === inputRef.current.value) {
      setTimeout(() => {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          "https://hooks-01-starting-project.firebaseio.com/ingredients.json" +
            query
        )
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }, 500);
    }
  }, [enteredFilter, onLoadIngredients, inputRef]);

  // cannot simply use fetch to get information from the server here because
  // it will run once the component is rendered. Then it will chnage the state
  // causing the component to rerender, thus creating an infinite loop

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
