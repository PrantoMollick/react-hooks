import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients])


  const addIngredienthandler = (ingredient) => {
    fetch('https://react-hooks-update-6efe2-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST', 
      body: JSON.stringify(ingredient), 
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      return response.json();
    })
    .then(responseData => {
      setUserIngredients((prevState) => [
        ...prevState,
        { id: responseData.name, ...ingredient },
      ]);
    })
  };

  const filterIngredientsHandler = useCallback((filterIngredientText) => {
    setUserIngredients(filterIngredientText);
  }, [])

  const removeIngredientHandler = ingredientId => {
    fetch(`https://react-hooks-update-6efe2-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE', 
    })
    .then(response => {
      setUserIngredients(prevIngredients => {
        return prevIngredients.filter(ingredient => ingredient.id !== ingredientId);
      })
    })
  };
  

  return (
    <div className='App'>
      <IngredientForm onAddIngredient={addIngredienthandler} />
      <section>
        <Search onLoadingIngredients={filterIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
