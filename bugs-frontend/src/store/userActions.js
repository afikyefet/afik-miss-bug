import { userService } from '../services/user.service.js'
import { store } from './store.js'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

import {
  SET_USERS,
  REMOVE_USER,
  EDIT_USER,
  SET_LOGGED_IN_USER,
} from './userReducer.js'

export async function loadusers(filter = {}) {
  try {
    const users = await userService.query(filter)

    await store.dispatch({ type: SET_USERS, users: users })

    showSuccessMsg('users loaded and filtered!')
  } catch (err) {
    showErrorMsg('users did not load')
    throw err
  }
}

export async function loadUser(userId) {
  try {
    const user = await userService.getById(userId)

    await store.dispatch({ type: SET_LOGGED_IN_USER, user: user })

    showSuccessMsg('user loaded')
    return user
  } catch (error) {
    showErrorMsg('could not find user')
    throw error
  }
}

export async function removeuser(userId) {
  try {
    await userService.remove(userId)
    await store.dispatch({ type: REMOVE_USER, userId })
    showSuccessMsg('user removed!')
  } catch (error) {
    showErrorMsg('could not remove user!')
    throw error
  }
}

export async function addEditUser(user) {
  try {
    let users = store.getState().userModule.users

    const saveduser = await userService.save(user)

    const method = users.some(
      (existingUser) => existingUser._id === saveduser._id
    )
      ? 'EDIT_USER'
      : 'ADD_USER'

    await store.dispatch({ type: method, user: saveduser })

    showSuccessMsg('user added!')
  } catch (err) {
    showErrorMsg('user not added!')
    throw err
  }
}

export async function edituser(user) {
  try {
    const saveduser = await userService.save(user)
    await store.dispatch({ type: EDIT_USER, user: saveduser })
    showSuccessMsg('user edited!')
  } catch (error) {
    showErrorMsg('failed to edit user')
    throw error
  }
}

export async function signUp(info) {
  try {
    const savedUser = await userService.signup(info)

    await store.dispatch({ type: SET_LOGGED_IN_USER, user: savedUser })

    showSuccessMsg('welcome ' + savedUser.fullname)
    return savedUser
  } catch (error) {
    showErrorMsg('could not sign up')
    throw error
  }
}

export async function logout() {
  try {
    showSuccessMsg('logged out')
    await userService.logout()

    await store.dispatch({ type: SET_LOGGED_IN_USER, user: null })
  } catch (error) {
    showErrorMsg('could not log out')
    throw error
  }
}

export async function login(user) {
  try {
    const loggedInUser = await userService.login(user)

    await store.dispatch({ type: SET_LOGGED_IN_USER, user: loggedInUser })
    console.log('user', loggedInUser);

    showSuccessMsg('welcome ' + loggedInUser.fullname)
  } catch (error) {
    showErrorMsg('could not log in')
    throw error
  }
}
