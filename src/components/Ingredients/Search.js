import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo((props) => {
  const [enteredFilter, setEnteredFilter] = useState('');

  const searchInputRef = useRef();


  const { onLoadingIngredients } = props;

  useEffect(() => {
    const timmer =setTimeout(() => {
      if(enteredFilter === searchInputRef.current.value) {
  
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;

        fetch(
          'https://react-hooks-update-6efe2-default-rtdb.firebaseio.com/ingredients.json' +
            query
        )
        .then((response) => response.json())
        .then((data) => {
          const loadIngredients = [];
          for (const key in data) {
            loadIngredients.push({
              id: key,
              title: data[key].title,
              amount: data[key].amount,
            });
          }
          onLoadingIngredients(loadIngredients);
        });
      }
    }, 600);

    return () => {
      clearTimeout(timmer);
    }
    
  }, [enteredFilter, onLoadingIngredients, searchInputRef]);

  return (
    <section className='search'>
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
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
