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

The 