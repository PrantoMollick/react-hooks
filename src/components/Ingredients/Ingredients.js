import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    fetch('https://react-hooks-update-6efe2-default-rtdb.firebaseio.com/ingredients.json')
    .then(response => response.json())
    .then(data => {
      const loadIngredients = [];
      for (const key in data) {
        loadIngredients.push({
          id: key, 
          title: data[key].title, 
          amount: data[key].amount
        })
      }

      setUserIngredients(loadIngredients);

    })
  }, []);  


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
