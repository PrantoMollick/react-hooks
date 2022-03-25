import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [ userIngredients, setUserIngredients ] = useState([]);

  const addIngredienthandler = ingredient  => {
    setUserIngredients(prevState => [...prevState, { id: Math.random().toString(), ...ingredient}]);
  }


  return (
    <div className="App">
      <IngredientForm onAddIngredient = {addIngredienthandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem = {() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
