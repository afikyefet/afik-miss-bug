
import axios, { Axios } from 'axios'

const myAxios = axios.create({
    withCredentials: true, // Send cookies with requests (if needed)
})

const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'


// const BASE_URL = (process.env.NODE_ENV !== 'development') ?
//     '/api/' :
//     '//localhost:3333/api/'

const BASE_URL = 'http://localhost:3333/api/'

const BASE_USER_URL = BASE_URL + 'user/'
const BASE_AUTH_URL = BASE_URL + 'auth/'

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
        const { data: users } = await myAxios.get(BASE_USER_URL)
        return users
    } catch (err) {
        console.error('Failed to get users', err)
        throw err
    }
}

async function query() {
    const { data: users } = await myAxios.get(BASE_USER_URL)
    return users
}
function getById(userId) {
    return myAxios.get(BASE_USER_URL + userId)
        .then(res => res.data)
}
function remove(userId) {
    return myAxios.delete(BASE_USER_URL + userId)
        .then(res => res.data)
}
async function save(user) {
    let response;
    if (user._id) {
        response = await myAxios.put(BASE_USER_URL, user);
    } else {
        response = await myAxios.post(BASE_USER_URL, user);
    }
    return response.data;
}

async function login(credentials) {
    try {
        const { data: user } = await myAxios.post(BASE_AUTH_URL + 'login', credentials)
        console.log(user);
        if (user) {
            return saveLocalUser(user)
        }

    } catch (err) {
        console.error('Failed to login', err)
        throw err
    }
}

async function signup(credentials) {
    try {
        const { data: user } = await myAxios.post(BASE_AUTH_URL + 'signup', credentials)
        return saveLocalUser(user)
    } catch (err) {
        console.error('Failed to signup', err)
        throw err
    }
}

async function logout() {
    try {
        await myAxios.post(BASE_AUTH_URL + 'logout')

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
        imgUrl: '',
        score: 0,
    }
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}
