import styles from './styles/App.module.css'
import {useState, useReducer, useEffect, useCallback} from "react";
import  { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
    reducer as todosReducer,
    actions as todoActions,
    initialState as initialTodosState,
} from './reducers/todos.reducer.js'

import TodosPage from './pages/TodosPage'
import Header from "./shared/Header.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";

function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}



function App() {
    const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
    const token = `Bearer ${import.meta.env.VITE_PAT}`;

    const [todoListState, dispatch] = useReducer(todosReducer, initialTodosState);

    const debouncedQueryString = useDebounce(todoListState.queryString, 500);
    const [newTodoTitle, setNewTodoTitle] = useState('');

    const encodeUrl = useCallback(() => {
        const baseId = import.meta.env.VITE_BASE_ID;
        const tableName = import.meta.env.VITE_TABLE_NAME;
        let sortQuery = `sort[0][field]=${todoListState.sortField}&sort[0][direction]=${todoListState.sortDirection}`;
        let searchQuery = '';
        if (debouncedQueryString) {
            searchQuery = `&filterByFormula=SEARCH("${debouncedQueryString}",+title)`;
        }
        return `https://api.airtable.com/v0/${baseId}/${tableName}?${sortQuery}${searchQuery}`
    }, [todoListState.sortField, todoListState.sortDirection, debouncedQueryString])

    useEffect(() => {
        const fetchTodos = async () => {
            dispatch({type: todoActions.fetchTodos});
            const fetchUrl = encodeUrl();

            const options = {
                method: "GET",
                headers: {
                    "Authorization": token,
                },
            };

            try {
                const resp = await fetch(fetchUrl, options);

                if (!resp.ok) {
                    throw new Error(`Error: ${resp.statusText}`);
                }

                const data = await resp.json();

                dispatch({
                    type: todoActions.loadTodos,
                    records: data.records,
                });
            } catch (error) {
                dispatch({type: todoActions.setLoadError, error});
            } finally {
                dispatch({type: todoActions.endRequest});
            }
        };
        fetchTodos();
    }, [encodeUrl]);

    const deleteTodo = async (todoId) => {
        const options = {
            method: 'DELETE',
            headers: {
                Authorization: token,
            },
        };

        try {
            const deleteUrl = `${url}/${todoId}`;
            const resp = await fetch(deleteUrl, options);
            if (!resp.ok) {
                throw new Error(`Error: ${resp.statusText}`);
            }
            dispatch({type: todoActions.deleteTodo, payload: todoId});
        } catch (error) {
            console.error(error);
            dispatch({type: todoActions.setLoadError, payload: error.message});
        }
    };

    const addTodo = async (newTodo) => {
        dispatch({type: todoActions.startRequest});
        const payload = {
            records: [
                {
                    fields: {
                        title: newTodo.title,
                        isCompleted: newTodo.isCompleted ?? false,
                    },
                },
            ],
        };
        const options = {
            method: 'POST',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };


        try {
            const resp = await fetch(url, options);
            if (!resp.ok) {
                throw new Error(`Error: ${resp.statusText}`);
            }

            const {records} = await resp.json();
            if (!records || !records[0]) {
                console.error("Invalid response from Airtable: no records returned", records);
                return;
            }
            dispatch({
                type: todoActions.addTodo,
                payload: {
                    todo: {
                        id: records[0].id,
                        title: records[0].fields.title,
                        isCompleted: records[0].fields.isCompleted ?? false,
                    },
                },
            });
            setNewTodoTitle('');
        } catch (error) {
            dispatch({
                type: todoActions.setLoadError,
                error,
            });
        } finally {
            dispatch({type: todoActions.endRequest});
        }
    };

    const handleToggleCompleted = (todoId) => {
        const todo = todoListState.todoList.find(t => t.id === todoId);
        if (todo) {
            updateTodo({...todo, isCompleted: !todo.isCompleted});
        }
    };

    const updateTodo = async (editedTodo) => {
        dispatch({type: todoActions.startRequest});

        const originalTodo = todoListState.todoList.find(t => t.id === editedTodo.id);

        const payload = {
            records: [
                {
                    id: editedTodo.id,
                    fields: {
                        title: editedTodo.title,
                        isCompleted: editedTodo.isCompleted,
                    },
                },
            ],
        };

        const options = {
            method: 'PATCH',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };

        try {
            const resp = await fetch(url, options);
            if (!resp.ok) {
                throw new Error(`Error: ${resp.statusText}`);
            }

            const {records} = await resp.json();
            dispatch({
                type: todoActions.updateTodo,
                payload: {
                    todo: {
                        id: records[0].id,
                        title: records[0].fields.title,
                        isCompleted: records[0].fields.isCompleted ?? false,
                    },
                },
            });
        } catch (error) {
            dispatch({
                type: todoActions.setLoadError,
                error,
            });
            dispatch({
                type: todoActions.revertTodo,
                payload: {
                    original: originalTodo,
                },
            });
        } finally {
            dispatch({type: todoActions.endRequest});
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Header title="My Todos"/>
            </header>
            <main>
                <Routes>
                    <Route
                        path="/"
                        element={
                <TodosPage
                    todoListState={todoListState}
                    onToggleCompleted={handleToggleCompleted}
                    onUpdateTodo={updateTodo}
                    onDeleteTodo={deleteTodo}
                    onAddTodo={addTodo}
                    newTodoTitle={newTodoTitle}
                    setNewTodoTitle={setNewTodoTitle}
                    setSortField={(value) => dispatch({type: todoActions.setSortField, payload: value})}
                    setSortDirection={(value) => dispatch({type: todoActions.setSortDirection, payload: value})}
                    setQueryString={(value) => dispatch({type: todoActions.setQueryString, payload: value})}
                    clearError={() => dispatch({type: todoActions.clearError})}
                />
                        }
                    />
                <Route
                    path="/about"
                    element={<About />}
                />
                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Routes>
            </main>
        </div>
    )
}

export default App