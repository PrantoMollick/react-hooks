import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const addIngredienthandler = (ingredient) => {
    setIsLoading(true);
    fetch(
      'https://react-hooks-update-6efe2-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((responseData) => {
        setUserIngredients((prevState) => [
          ...prevState,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  const filterIngredientsHandler = useCallback((filterIngredientText) => {
    setUserIngredients(filterIngredientText);
  }, []);

  const removeIngredientHandler = (ingredientId) => {
    fetch(
      `https://react-hooks-update-6efe2-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE',
      }
    )
    .then((response) => {
      setUserIngredients((prevIngredients) => {
        return prevIngredients.filter(
          (ingredient) => ingredient.id !== ingredientId
        );
      });
    })
    .catch(error => {
      setIsError('Something wen Wrong');
      setIsLoading(false);
    });
  };

  const clearError = () => {
    setIsError(null);

  }


  return (
    <div className='App'>
      {isError && <ErrorModal onClose={clearError}>{isError}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredienthandler}
        loading={isLoading}
      />
      <section>
        <Search onLoadingIngredients={filterIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
