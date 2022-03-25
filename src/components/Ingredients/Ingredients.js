import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

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


const httpReducer = (curHttpState, action) => {
  switch(action.type) {
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      return {...curHttpState, loading: false}
    case 'ERROR':
      return {loading: false, error: action.errorMessage}
    default:
      throw new Error('should not be reached!')
  }
  
}



function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const addIngredienthandler = (ingredient) => {
    dispatchHttp({type: 'SEND'})
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
        dispatchHttp({type: 'RESPONSE'})
        return response.json();
      })
      .then((responseData) => {
        // setUserIngredients((prevState) => [
        //   ...prevState,
        //   { id: responseData.name, ...ingredient },
        // ]);
        dispatch({
          type: 'ADD',
          ingredient: { id: responseData.name, ...ingredient },
        });
      });
  };

  const filterIngredientsHandler = useCallback((filterIngredientText) => {
    // setUserIngredients(filterIngredientText);
    dispatch({ type: 'SET', ingredients: filterIngredientText });
  }, []);

  const removeIngredientHandler = (ingredientId) => {
    fetch(
      `https://react-hooks-update-6efe2-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE',
      }
    )
    .then((response) => {
      dispatch({type: 'DELETE', id: ingredientId});
    })
    .catch(error => {
      dispatchHttp({type: 'ERROR', errorMessage: 'Something went Wrong' })
      dispatchHttp({type: 'RESPONSE'})
      
    });
  };

  const clearError = () => {
    dispatchHttp({type: 'ERROR'});
  }


  return (
    <div className='App'>
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredienthandler}
        loading={httpState.loading}
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
