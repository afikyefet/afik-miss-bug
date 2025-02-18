
import axios, { Axios } from 'axios'

const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'


const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/' :
    '//localhost:3333/api/'

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
        const { data: users } = await axios.get(BASE_USER_URL)
        return users
    } catch (err) {
        console.error('Failed to get users', err)
        throw err
    }
}

async function query() {
    const { data: users } = await axios.get(BASE_USER_URL)
    return users
}
function getById(userId) {
    return axios.get(BASE_USER_URL + userId)
        .then(res => res.data)
}
function remove(userId) {
    return axios.delete(BASE_USER_URL + userId)
        .then(res => res.data)
}
async function save(user) {
    let response;
    if (user._id) {
        response = await axios.put(BASE_USER_URL, user);
    } else {
        user.score = 1000
        if (!user.imgUrl) user.imgUrl = "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
        user.isAdmin = false
        response = await axios.post(BASE_USER_URL, user);
    }
    return response.data;
}

async function login(credentials) {
    try {
        const { data: user } = await axios.post(BASE_AUTH_URL + 'login', credentials)
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
        credentials.score = 1000
        if (!credentials.imgUrl) credentials.imgUrl = "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
        credentials.isAdmin = false
        const { data: user } = await axios.post(BASE_AUTH_URL + 'signup', credentials)
        return saveLocalUser(user)
    } catch (err) {
        console.error('Failed to signup', err)
        throw err
    }
}

async function logout() {
    try {
        await axios.post(BASE_AUTH_URL + 'logout')
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
