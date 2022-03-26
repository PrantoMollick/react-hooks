import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../utils/http';

import './Search.css';

const Search = React.memo((props) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const searchInputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  const { onLoadingIngredients } = props;

  useEffect(() => {
    const timmer = setTimeout(() => {
      if (enteredFilter === searchInputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest(
          'https://react-hooks-update-6efe2-default-rtdb.firebaseio.com/ingredients.json' +
            query,
          'GET'
        );
      }
    }, 600);

    return () => {
      clearTimeout(timmer);
    };
  }, [enteredFilter, searchInputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadIngredients = [];
      for (const key in data) {
        loadIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadingIngredients(loadIngredients);
    }
  }, [data, isLoading, error, onLoadingIngredients]);

  return (
    <section className='search'>
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          {isLoading && <span>Loading....</span>}
          <input
            type='text'
            value={enteredFilter}
            ref={searchInputRef}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
