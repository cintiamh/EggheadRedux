# Getting Started With Redux

https://egghead.io/courses/getting-started-with-redux

The idea behind Redux is that there is a single State Object representing the state of the whole application.

The state tree content is read only. You can NOT add or edit it's content. Instead, to make any changes, you
need to dispatch an action.

An Action is a JavaScript object describing the change. The only requirement of this object is to have a "type"
property in it with a string value:

```javascript
{ type: "INCREMENT" }
```

## Difference between pure and impure functions

Pure functions: its returning values depends solely on input values. No side effects (even DB or network). It also doesn't modify the input.

```javascript
function square(x) {
    return x * x;
}
function squareAll(items) {
    return items.map(square);
}
```

Impure functions: It might have side effects and changes.

```javascript
function square(x) {
    updateXInDatabase(x);
    return x * x;
}
function squareAll(items) {
    for (let i = 0; i < items.length; i++) {
        items[i] = square(items[i]);
    }
}
```

For Redux we need to always use pure functions.

## The Reducer function

The Reducer function in Redux is a pure function, that gets the "previous state" and the "dispatched action"
object and returns the "next state" object.

Even in a large application, you need to return a new state object, but when large parts of the object didn't change,
you can keep the reference to the previous object and just modify what had been changed with the action.

## Writing a Counter Reducer with Tests

```javascript
function counter(state, action) {
    if (typeof state === 'undefined') {
        // returns what is considered to be the initial state for counter.
        return 0;
    }
    if (action.type === 'INCREMENT') {
        return state + 1;
    } else if (action.type === 'DECREMENT') {
        return state - 1;
    } else {
        return state;
    }
}
```

After some refactoring:

```javascript
const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}
```

## Store Methods

The Store in Redux holds the current application state object, it lets you dispatch actions, and when you
create it, you need to specify the reducer, which tells how the state will be updated according to the actions.

### `getState`

`store.getState()` - returns the current state object the store's holding.

### `dispatch`

`store.dispatch({ type: 'INCREMENT' })` - dispatches an action.

### `subscribe`

Subscribe a method to be called every time something changes in the store.

This would be our very first, very simple Redux application:

```javascript
import { createStore } from 'redux';
const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
};
const store = createStore(counter);
const render = () => {
    document.body.innerText = store.getState();
};
store.subscribe(render);
render();
document.addEventListener('click', () => {
    store.dispatch({ type: 'INCREMENT' });
});
export { counter };
```

## Using React

```javascript
import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
};

const Counter = ({
    value,
    onIncrement,
    onDecrement
}) => (
    <div>
        <h1>{value}</h1>
        <button onClick={onIncrement}>+</button>
        <button onClick={onDecrement}>-</button>
    </div>
);

const store = createStore(counter);

const render = () => {
    ReactDOM.render(
        <Counter
            value={store.getState()}
            onIncrement={() =>
                store.dispatch({ type: 'INCREMENT' })
            }
            onDecrement={() =>
                store.dispatch({ type: 'DECREMENT' })
            }
        />,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();

export { counter };
```

## Avoiding array mutation with `concat()`, `slice()`, and `...` spread

In order to add a new element to an array, what we would normally do is to do something like:

```javascript
const addCounter = (list) => {
  list.push(0);  
};
```

But in this case, we're modifying the input array. To avoid that we can use concat instead:

```javascript
const addCounter = (list) => {
  return list.concat([0]);  
};
```

Or even the new `...spread` from ES6:

```javascript
const addCounter = (list) => {
  return [...list, 0];  
};
```

The same can be said about removing and element from the array. We normally would use splice as follow:

```javascript
const removeCounter = (list, index) => {
  list.splice(index, 1);
  return list;
}; 
```

But splice is mutating the input array. The way we can do this, is by using slice and concat.

```javascript
const removeCounter = (list, index) => {
  return list
    .slice(0, index)
    .concat(list.slice(index + 1));
}; 
```

Or to be more conscise, we can use the spread operator.

```javascript
const removeCounter = (list, index) => {
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];    
}; 
```

Now lets look into adding one of the counters in the array.

```javascript
const incrementCounter = (list, index) => {
  list[index]++;
  return list;
}
```

You can see that a mutation is happening in here, so we can try to do something like:

```javascript
const incrementCounter = (list, index) => {
    return list
      .slice(0, index)
      .concat([list[index] + 1])
      .concat(list.slice(index + 1));
}
```

Which looks a lot like the remove method. We can simplify this with the `...spread` opearator:

```javascript
const incrementCounter = (list, index) => {
    return [
      ...list.slice(0, index),
      list[index] + 1,
      ...list.slice(index + 1)
    ];
}
```

## Avoiding Object Mutations with `Object.assign()` and `...spread`

A version with mutation first:

```javascript
const toggleTodo = (todo) => {
  todo.completed = !todo.completed;
  return todo;
}
```

Using Object.assign():

```javascript
const toggleTodo = (todo) => {
  return Object.assign({}, todo, {
    completed: !todo.completed
  });
}
```

The first argument is the target object, that's why it's an empty object. And the last argument wins over the 
previous ones.

We can also use the spread here:

```javascript
const toggleTodo = (todo) => {
  return {
    ...todo,
    completed: !todo.completed
  };
}
```

