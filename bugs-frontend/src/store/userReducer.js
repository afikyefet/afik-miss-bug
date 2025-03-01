import { userService } from '../services/user.service'

export const SET_USERS = 'SET_USERS'
export const REMOVE_USER = 'REMOVE_USER'
export const ADD_USER = 'ADD_USER'
export const EDIT_USER = 'EDIT_USER'
export const SET_FILTER = 'SET_FILTER'
export const SET_LOGGED_IN_USER = 'SET_LOGGED_IN_USER'

const initialState = {
    users: [],
    loggedInUser: userService.getLoggedinUser(),
    filterBy: {},
}

export function usersReducer(state = initialState, cmd) {
    switch (cmd.type) {
        case SET_USERS:
            return {
                ...state,
                users: cmd.users,
            }
        case REMOVE_USER:
            return {
                ...state,
                users: state.users.filter((user) => user._id !== cmd.userId),
            }
        case ADD_USER:
            return {
                ...state,
                users: [...state.users, { ...cmd.user }],
            }
        case EDIT_USER:
            return {
                ...state,
                users: state.users.map((user) =>
                    user._id === cmd.user._id ? cmd.user : user
                ),
            }
        case SET_FILTER:
            return {
                ...state,
                filterBy: cmd.filter,
            }
        case SET_LOGGED_IN_USER:
            return {
                ...state,
                loggedInUser: cmd.user,
            }

        default:
            return state
    }
}
