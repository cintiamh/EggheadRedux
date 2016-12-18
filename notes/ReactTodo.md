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

## React Todo List Example (Toggling a Todo)

```javascript
<ul>
    {this.props.todos.map(todo => {
        return (
            <li key={todo.id} onClick={() => {
                store.dispatch({
                    type: 'TOGGLE_TODO',
                    id: todo.id
                })
            }}
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none'
                }}
            >
                {todo.text}
            </li>
        );
    })}
</ul>
```

## React Todo List Example (Filtering Todos)

```javascript
const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(
                t => t.completed
            );
        case 'SHOW_ACTIVE':
            return todos.filter(
                t => !t.completed
            );
    }
}

const FilterLink = ({ filter, currentFilter, children }) => {
    if (filter === currentFilter) {
        return (<span>{children}</span>);
    }
  return (
      <a href="#" onClick={e => {
        e.preventDefault();
        store.dispatch({
        type: 'SET_VISIBILITY_FILTER', filter
      });
      }} >
          {children}
      </a>
  )
}

let nextTodoId = 0;
class TodoApp extends React.Component {
    render() {
        const { todos, visibilityFilter } = this.props;
        const visibleTodos = getVisibleTodos(todos, visibilityFilter);
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
                  {visibleTodos.map(todo => {
                      return (
                          <li key={todo.id} onClick={() => {
                              store.dispatch({
                                  type: 'TOGGLE_TODO',
                                  id: todo.id
                              })
                          }}
                              style={{
                                textDecoration: todo.completed ? 'line-through' : 'none'
                              }}
                          >
                              {todo.text}
                          </li>
                      );
                  })}
              </ul>
              <p>
                Show:
                  {' '}
                <FilterLink
                    filter="SHOW_ALL"
                    currentFilter={visibilityFilter}
                >All</FilterLink>
                  {' '}
                <FilterLink
                    filter="SHOW_ACTIVE"
                    currentFilter={visibilityFilter}
                >Active</FilterLink>
                  {' '}
                <FilterLink
                    filter="SHOW_COMPLETED"
                    currentFilter={visibilityFilter}
                >Completed</FilterLink>
              </p>
            </div>
        )
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp {...store.getState()} />,
        document.getElementById('root')
    )
};
```

## Extracting Presentational Components (Todo, TodoList)

Create the presentational components for Todo items and list.

```javascript
const Todo = ({onClick, completed, text}) => (
    <li
        onClick={onClick}
        style={{
            textDecoration: completed ? 'line-through' : 'none'
        }}
    >
        {text}
    </li>
);

const TodoList = ({todos, onTodoClick}) => (
    <ul>
        {todos.map(todo => (
            <Todo
                key={todo.id}
                {...todo}
                onClick={() => onTodoClick(todo.id)}
            />
        ))}
    </ul>
);
```

Inside the TodoApp, replace the `<ul>` with the created components:

```javascript
class TodoApp extends React.Component {
    //...
    <TodoList
        todos={visibleTodos}
        onTodoClick={id => {
            store.dispatch({
                type: 'TOGGLE_TODO',
                id
            })
        }}
    />
    //...
}
```

## Extracting Presentational Components (AddTodo, Footer, FilterLink)

```javascript
const AddTodo = ({onAddClick}) => {
    let input;

    return (
        <div>
            <input ref={node => {
                input = node;
            }}/>
            <button onClick={() => {
                onAddClick(input.value);
                input.value = '';
            }}>
                Add Todo
            </button>
        </div>
    )
};

const FilterLink = ({
    filter,
    currentFilter,
    onClick,
    children
}) => {
    if (filter === currentFilter) {
        return (<span>{children}</span>);
    }
    return (
        <a href="#" onClick={e => {
            e.preventDefault();
            onClick(filter);
        }} >
            {children}
        </a>
    )
};

const Footer = ({visibilityFilter, onFilterClick}) => {
    return (
        <p>
            Show:
            {' '}
            <FilterLink
                filter="SHOW_ALL"
                currentFilter={visibilityFilter}
                onClick={onFilterClick}
            >All</FilterLink>
            {' '}
            <FilterLink
                filter="SHOW_ACTIVE"
                currentFilter={visibilityFilter}
                onClick={onFilterClick}
            >Active</FilterLink>
            {' '}
            <FilterLink
                filter="SHOW_COMPLETED"
                currentFilter={visibilityFilter}
                onClick={onFilterClick}
            >Completed</FilterLink>
        </p>
    )
};
```

And now the AddTodo component can be not a class. 

```javascript
const TodoApp  = ({ todos, visibilityFilter }) => (
    <div>
        <AddTodo
            onAddClick={text => {
                store.dispatch({
                    type: 'ADD_TODO',
                    id: nextTodoId++,
                    text
                });
            }}
        />
        <TodoList
            todos={getVisibleTodos(todos, visibilityFilter)}
            onTodoClick={id => {
                store.dispatch({
                    type: 'TOGGLE_TODO',
                    id
                })
            }}
        />
        <Footer
            visibilityFilter={visibilityFilter}
            onFilterClick={filter => {
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter
                });
            }}
        />
    </div>
);
```

## Extracting Presentational Components (FilterLink)

At this point, we have a lot of components that only receives the info down from its parents, which is not ideal because
we're passing down a lot of props that are not being immediately used, but just passed to its children.

To solve this, we can have some more container components besides TodoApp.
