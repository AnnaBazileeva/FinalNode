export const actions = {
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    setLoadError: 'setLoadError',
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    updateTodo: 'updateTodo',
    clearError: 'clearError',
    completeTodo: 'completeTodo',
    revertTodo: 'revertTodo',
    deleteTodo: 'deleteTodo',
    setSortField: 'setSortField',
    setSortDirection: 'setSortDirection',
    setQueryString: 'setQueryString'
};

export const initialState = {
    isSaving: false,
    isLoading: false,
    errorMessage: '',
    todoList: [],
    newTodoTitle: '',
    sortField: 'createdTime',
    sortDirection: 'desc',
    queryString: '',
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.fetchTodos:
            return {
                ...state,
                isLoading: true
            };
        case actions.loadTodos:
            const todos = action.records.map(record => ({
                id: record.id,
                title: record.fields.title || "",
                isCompleted: record.fields.isCompleted || false,
            }));

            return {
                ...state,
                todoList: todos,
                isLoading: false,
            };
        case actions.setLoadError:
            return {
                ...state,
                isLoading: false,
                errorMessage: action.error?.message || 'Unknown error'
            };
        case actions.startRequest:
            return {
                ...state,
                isSaving: true,
            };
        case actions.addTodo:
            const savedTodo = {
                ...action.payload.todo,
                isCompleted: action.payload.todo?.isCompleted ?? false,
            };

            return {
                ...state,
                todoList: [...state.todoList, savedTodo],
                isSaving: false,
            };
        case actions.endRequest:
            return {
                ...state,
                isSaving: false,
                isLoading: false,
            };
        case actions.updateTodo:
            return {
                ...state,
                todoList: state.todoList.map(todo =>
                    todo.id === action.payload.todo.id ? action.payload.todo : todo
                ),
            };
        case actions.completeTodo:
            return {
                ...state,
                todoList: state.todoList.map(todo =>
                    todo.id === action.payload.id
                        ? { ...todo, isCompleted: !todo.isCompleted }
                        : todo
                ),
            };
        case actions.revertTodo:
            return {
                ...state,
                todoList: state.todoList.map(todo =>
                    todo.id === action.payload.original.id
                        ? action.payload.original
                        : todo
                ),
            };
        case actions.clearError:
            return {
                ...state,
                errorMessage: '',
            };
        case actions.deleteTodo:
            return {
                ...state,
                todoList: state.todoList.filter(todo => todo.id !== action.payload),
            };
        case actions.setSortField:
            return {
                ...state, sortField: action.payload
            };
        case actions.setSortDirection:
            return  {
                ...state, sortDirection: action.payload
            };
        case actions.setQueryString:
            return  {
                ...state, queryString: action.payload
            }

            default:
            return state;
    }
};


