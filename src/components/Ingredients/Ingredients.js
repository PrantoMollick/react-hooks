import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../utils/http';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET': 
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id );
    default:
      throw new Error('Should not get there!');
  }
};


function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, error, data, sendRequest} = useHttp();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const addIngredienthandler = useCallback((ingredient) => {
    // dispatchHttp({type: 'SEND'})
    // fetch(
    //   'https://react-hooks-update-6efe2-default-rtdb.firebaseio.com/ingredients.json',
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(ingredient),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )
    //   .then((response) => {
    //     dispatchHttp({type: 'RESPONSE'})
    //     return response.json();
    //   })
    //   .then((responseData) => {
    //     dispatch({
    //       type: 'ADD',
    //       ingredient: { id: responseData.name, ...ingredient },
    //     });
    //   });
  }, []);

  const filterIngredientsHandler = useCallback((filterIngredientText) => {
    dispatch({ type: 'SET', ingredients: filterIngredientText });
  }, []);

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      sendRequest(
        `https://react-hooks-update-6efe2-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        'DELETE'
      );
    },
    [sendRequest]
  );

  const clearError = useCallback( () => {
    // dispatchHttp({type: 'ERROR'});
  }, []);


  const ingredientList = useMemo(() => {
    return <IngredientList
      ingredients={userIngredients}
      onRemoveItem={removeIngredientHandler}
    />;
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className='App'>
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredienthandler}
        loading={isLoading}
      />
      <section>
        <Search onLoadingIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
