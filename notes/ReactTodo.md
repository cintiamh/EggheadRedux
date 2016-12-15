# React Todo App

## React Todo List Example (Adding a Todo)

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

// ... (all todo reducers code in here)

let nextTodoId = 0;
class TodoApp extends React.Component {
  render() {
    return (
      <div>
        <input ref={node => {
          this.input = node;
        }}/>
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          this.input.value = '';
        }}>
          Add Todo
        </button>
        <ul>
          {this.props.todos.map(todo => {
            return <li key={todo.id}>{todo.text}</li>
          })}
        </ul>
      </div>
    )
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp todos={store.getState().todos} />,
    document.getElementById('root')
)
};

store.subscribe(render);
render();
```