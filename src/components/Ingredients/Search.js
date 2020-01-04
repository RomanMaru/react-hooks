import React, { useState, useEffect, useRef } from 'react';
import useHttp from '../../hooks/http'
import ErrorModal from '../UI/ErrorModal'
import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngeredients } = props
  const [enteredFilter, setEnteredFilter] = useState('')
  const inputRef = useRef()
  const {
    isLoading,
    data,
    error,
    sendRequest,
    clear
  } = useHttp()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? ''
        : `?orderBy="title"&equalTo="${enteredFilter}"`
      sendRequest(
        'https://reacthooks-e845e.firebaseio.com/ingredients.json' + query,
        'GET'
        )
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [enteredFilter, sendRequest, inputRef])

  useEffect(() => {
if (!isLoading && !error && data) {
  const loadedIngredients = []
  for (const key in data) {
    loadedIngredients.push({
      id: key,
      title: data[key].title,
      amount: data[key].amount
    })
  }
  onLoadIngeredients(loadedIngredients)
}
  }, [data, isLoading, error, onLoadIngeredients])

  return (
    <section className="search">
    {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
