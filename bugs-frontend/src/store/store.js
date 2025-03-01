import {
    combineReducers,
    compose,
    legacy_createStore as createStore,
} from 'redux'

import { bugsReducer } from './BugReducer.js'
import { usersReducer } from './userReducer.js'
const rootReducer = combineReducers({
    bugsModule: bugsReducer,
    userModule: usersReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(rootReducer, composeEnhancers())

window.gStore = store