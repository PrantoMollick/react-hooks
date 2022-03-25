import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

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

  return (
    <div className='App'>
      <IngredientForm onAddIngredient={addIngredienthandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
