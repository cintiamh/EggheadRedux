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

## Extracting Container Components (FilterLink)

At this point, we have a lot of components that only receives the info down from its parents, which is not ideal because
we're passing down a lot of props that are not being immediately used, but just passed to its children.

To solve this, we can have some more container components besides TodoApp.

```javascript
const Link = ({
    active,
    onClick,
    children
}) => {
    if (active) {
        return (<span>{children}</span>);
    }
    return (
        <a href="#" onClick={e => {
            e.preventDefault();
            onClick();
        }} >
            {children}
        </a>
    )
};

class FilterLink extends React.Component {
    componentDidMount() {
        // this is not really working, but we'll change this soon.
        this.unsubscribe = store.subscribe(() => {
            // This is from React to force refresh.
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        // At this point, if the component is not subscribed to the store, it gets stale data.
        const state = store.getState();

        return (
            <Link
                active={
                    props.filter === state.visibilityFilter
                }
                onClick={() => {
                    store.dispatch({
                        type: 'VISIBILITY_FILTER',
                        filter: props.filter
                    })
                }}
            >{props.children}</Link>
        )
    }
}
```

## Extracting Container Components (VisibleTodoList, AddTodo)

```javascript
let nextTodoId = 0;
const AddTodo = () => {
    let input;

    return (
        <div>
            <input ref={node => {
                input = node;
            }}/>
            <button onClick={() => {
                store.dispatch({
                    type: 'ADD_TODO',
                    id: nextTodoId++,
                    text: input.value
                });
                input.value = '';
            }}>
                Add Todo
            </button>
        </div>
    )
};

class VisibleTodoList extends React.Component {
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const state = store.getState();

        return (
            <TodoList
                todos={
                    getVisibleTodos(state.todos, state.visibilityFilter)
                }
                onTodoClick={id => {
                    store.dispatch({
                        type: 'TOGGLE_TODO',
                        id
                    })
                }}
            />
        )
    }
}
```

And because all TodoApp's components are subscribed themselves to the store, we can remove the render.

```javascript
const TodoApp  = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);

ReactDOM.render(
    <TodoApp />,
    document.getElementById('root')
);
```

## Passing the store down explicitly via Props

Up to now we've been using the store in a variable.

```javascript
const TodoApp  = ({ store }) => (
    <div>
        <AddTodo store={store} />
        <VisibleTodoList store={store} />
        <Footer store={store} />
    </div>
);

ReactDOM.render(
    <TodoApp
        store={createStore(todoApp)}
    />,
    document.getElementById('root')
);

// for each one of the containers:
const { store } = this.props;
```

## Passing the store down implicitly via context

First we create a Provider component which will be the context provider. It will only render its 
children.

```javascript
class Provider extends React.Component {
    getChildContext() {
        return {
            store: this.props.store
        };
    }

    render() {
        return this.props.children;
    }
}

Provider.childContextTypes = {
    store: React.PropTypes.object
};

ReactDOM.render(
    <Provider store={createStore(todoApp)}>
        <TodoApp />
    </Provider>,
    document.getElementById('root')
);
```

Now we need to make all the containers to receive the store from context, and not props.
And also we need to set that those components are receiving the context, setting its contextTypes.

```javascript
class VisibleTodoList extends React.Component {
    componentDidMount() {
        const { store } = this.context;
        // ...
    }
}
VisibleTodoList.contextTypes = {
    store: React.PropTypes.object
};
```

For the functional components like AddTodo, we can retrieve the context as the second argument:

```javascript
const AddTodo = (props, context) => { /*...*/ }
AddTodo.contextTypes = {
    store: React.PropTypes.object
};
```

But the concept of context contradicts the principal of React to explicitly pass down properties.
And the context also is not very stable. Use with caution.

## Passing the store down with `<Provider>` from React Redux

The Provider concept is so useful that it is available in the `react-redux` npm package
https://www.npmjs.com/package/react-redux

```
$ npm i react-redux --save
```

And then import:

```javascript
import { Provider } from 'react-redux';
```

This Provider will do exactly the same as the one we implemented before.

## Generating Containers with connect() from ReactRedux (VisibleTodoList)

```javascript
import { Provider, connect } from 'react-redux';

// This returns the props necessary from the store state
const mapStateToProps = (state) => {
    return {
        todos: getVisibleTodos(
            state.todos,
            state.visibilityFilter
        )
    }
};

// This will map the dispatch method from the store.
const mapDispatchToProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch({
                type: 'TOGGLE_TODO',
                id
            })
        }
    }
};

// Connect method from React redux will link the store state and dispatch methods to the presentation component
// Connect will merge the objects from mapStateToPros, mapDispatchToProps and the component props.
const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoList);
```

## Generating Containers with connect() from ReactRedux (AddTodo)

```javascript
let nextTodoId = 0;
let AddTodo = ({ dispatch }) => {
    let input;

    return (
        <div>
            <input ref={node => {
                input = node;
            }}/>
            <button onClick={() => {
                dispatch({
                    type: 'ADD_TODO',
                    id: nextTodoId++,
                    text: input.value
                });
                input.value = '';
            }}>
                Add Todo
            </button>
        </div>
    )
};
// The default behavior here is to not subscribe to the store and inject dispatch to props
AddTodo = connect()(AddTodo);
```

## Generating Containers with connect() from ReactRedux (FooterLink)

```javascript
const mapStateToLinkProps = (state, ownProps) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    };
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch({
                type: 'SET_VISIBILITY_FILTER',
                filter: ownProps.filter
            });
        }
    }
};

const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link);
```

## Extracting Action Creators

```javascript
// Action Creators
let nextTodoId = 0;
const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
    };
};

const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    };
};

const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id
    };
};
```

And just call those inside dispatch.

```javascript
dispatch(addTodo(input.value));
```