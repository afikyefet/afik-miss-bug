export const SET_BUGS = 'SET_BUGS'
export const REMOVE_BUG = 'REMOVE_BUG'
export const ADD_BUG = 'ADD_BUG'
export const EDIT_BUG = 'EDIT_BUG'
export const SET_FILTER = 'SET_FILTER'

const initialState = {
    bugs: [],
    filterBy: {},
}

export function bugsReducer(state = initialState, cmd) {
    switch (cmd.type) {
        case SET_BUGS:
            return {
                ...state,
                bugs: cmd.bugs,
            }
        case REMOVE_BUG:
            return {
                ...state,
                bugs: state.bugs.filter((bug) => bug._id !== cmd.bugId),
            }
        case ADD_BUG:
            return {
                ...state,
                bugs: [...state.bugs, { ...cmd.bug }],
            }
        case EDIT_BUG:
            return {
                ...state,
                bugs: state.bugs.map((bug) =>
                    bug._id === cmd.bug._id ? cmd.bug : bug
                ),
            }
        case SET_FILTER:
            return {
                ...state,
                filterBy: cmd.filter,
            }

        default:
            return state
    }
}