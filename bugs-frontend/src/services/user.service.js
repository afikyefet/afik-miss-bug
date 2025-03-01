
import axios, { Axios } from 'axios'
import { httpService } from './http.service'

const myAxios = axios.create({
    withCredentials: true, // Send cookies with requests (if needed)
})

const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'


// const BASE_URL = (process.env.NODE_ENV !== 'development') ?
//     '/api/' :
//     '//localhost:3333/api/'

const BASE_URL = 'http://localhost:3333/api/'

const BASE_USER_URL = 'user/'
const BASE_AUTH_URL = 'auth/'

export const userService = {
    getUsers,
    query,
    getById,
    save,
    remove,
    getEmptyUser,
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser
}
async function getUsers() {
    try {
        return await httpService.get(BASE_USER_URL)
    } catch (err) {
        console.error('Failed to get users', err)
        throw err
    }
}

async function query() {
    return await httpService.get(BASE_USER_URL)
}

function getById(userId) {
    return httpService.get(`${BASE_USER_URL}${userId}`)
}

function remove(userId) {
    return httpService.delete(`${BASE_USER_URL}${userId}`)
}

async function save(user) {
    if (user._id) {
        return await httpService.put(BASE_USER_URL, user)
    } else {
        return await httpService.post(BASE_USER_URL, user)
    }
}

async function login(credentials) {
    try {
        const user = await httpService.post(`${BASE_AUTH_URL}login`, credentials)
        if (user && user._id) {
            saveLocalUser(user)
            return user
        } else {
            console.error('Login failed: Invalid user data received.')
            return null
        }
    } catch (err) {
        console.error('Failed to login', err)
        throw err
    }
}

async function signup(credentials) {
    try {
        const user = await httpService.post(`${BASE_AUTH_URL}signup`, credentials)
        if (user && user._id) {
            saveLocalUser(user)
            return user
        } else {
            console.error('Signup failed: Invalid user data received.')
            return null
        }
    } catch (err) {
        console.error('Failed to signup', err)
        throw err
    }
}


async function logout() {
    try {
        await httpService.post(`${BASE_AUTH_URL}logout`)
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    } catch (err) {
        console.error('Failed to logout', err)
        throw err
    }
}

function getEmptyUser() {
    return {
        fullname: '',
        username: '',
        password: '',
        score: 0,
    }
}

function saveLocalUser(user) {
    if (user) {
        const minimalUser = {
            _id: user._id,
            fullname: user.fullname || 'Guest',
            isAdmin: user.isAdmin || false
        }
        sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(minimalUser))
        return minimalUser
    } else {
        console.error('Cannot save undefined user')
        return null
    }
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)) || null
}