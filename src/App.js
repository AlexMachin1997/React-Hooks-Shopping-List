import React, { useState, useEffect, useCallback } from 'react';
import shortid from 'shortid'
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCircle, faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';


const useLocalStorage = (key, defaultValue = []) => {

  const [state, setState] = useState(() => {
    const items = window.localStorage.getItem(key);

    if(items === null) return defaultValue;

    return JSON.parse(items);
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
}

const App = () => {
  
  const [items, setItems] = useLocalStorage('items'); 
  const [name, setName] = useState('');

  const addItems = () => {
    if(name.length === 0) return;

    const currentShoppingList = [...items];

    const shoppingListItem = {
      id: shortid(),
      name: name,
      completed: false,
      quantity: 1
    };

    currentShoppingList.push(shoppingListItem);

    setItems(currentShoppingList);

    setName('');
  };

  const updateAnItemsQuantity = (id, operation) => {
    const currentShoppingList = [...items];
    
    const currentShoppingListItem = currentShoppingList.find(item => item.id === id);

    switch(operation) {
      case 'add' : {
        currentShoppingListItem.quantity += 1;
        break;        
      }

      case 'subtract': {
        if(currentShoppingListItem.quantity === 0) return;
        
        currentShoppingListItem.quantity -= 1;

        break;
      }

      default: {
        currentShoppingListItem.quantity += 1;
        break;      
      }
    }

    setItems(currentShoppingList);

  };

  const updateAnItemsStatus = id => {
    const currentShoppingList = [...items];

    const currentShoppingListItem = currentShoppingList.find(item => item.id === id);

    currentShoppingListItem.completed =  !currentShoppingListItem.completed;

    setItems(currentShoppingList);    
  };


	return (
		<div className='app-background'>
			<div className='main-container'>
				<div className='add-item-box'>
					<input className='add-item-input' placeholder='Add an item...' onChange={(e) => setName(e.target.value)} value={name} />
          <div onClick={addItems}>
					<FontAwesomeIcon icon={faPlus} />
          </div>
				</div>
				<div className='item-list'>
          
          {items.map((data,index) => (
            <div className='item-container' key={index}>
              <div className='item-name' onClick={() => updateAnItemsStatus(data.id)}>
                <FontAwesomeIcon icon={data.completed === true ? faCheckCircle : faCircle } />
                <span className={data.completed === true ? 'completed' : 'empty'}>{data.name}</span>
              </div>

              <div className='quantity'>
                <button onClick={() => updateAnItemsQuantity(data.id, 'subtract')} disabled={data.completed}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span> {data.quantity} </span>
                <button onClick={() => updateAnItemsQuantity(data.id, 'add')} disabled={data.completed}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
					  </div>
          ))}
          
				</div>
				<div className='total'>Total: {items.length}</div>
			</div>
		</div>
	);
};

export default App;