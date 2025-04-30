// services/user.service.js
import { storageService } from '../async-storage.service'
import { utilService } from '../util.service'; // for makeId() – replace / remove if you use a different helper

const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    // data
    query,
    getById,
    save,
    remove,
    getEmptyUser,

    // auth
    login,
    signup,
    logout,
    getLoggedinUser,
    saveLocalUser
}

/* ----------------------------------------------------------------
 * CRUD
 * ----------------------------------------------------------------*/
async function query() {
    return await storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function remove(userId) {
    return storageService.remove(STORAGE_KEY, userId)
}

async function save(user) {
    if (user._id) return await storageService.put(STORAGE_KEY, user)
    return await storageService.post(STORAGE_KEY, user)
}

/* ----------------------------------------------------------------
 * AUTH  (all local – no HTTP)
 * ----------------------------------------------------------------*/
async function login({ username, password }) {
    const users = await storageService.query(STORAGE_KEY)
    const user = users.find(u => u.username === username && u.password === password)

    if (!user) throw new Error('Invalid username or password')

    return saveLocalUser(user)
}

async function signup({ fullname, username, password }) {
    const users = await storageService.query(STORAGE_KEY)

    if (users.some(u => u.username === username))
        throw new Error('Username already taken')

    const userToSave = {
        _id: utilService.makeId(),
        fullname,
        username,
        password,
        score: 0,
        isAdmin: false
    }

    await storageService.post(STORAGE_KEY, userToSave)
    return saveLocalUser(userToSave)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    return Promise.resolve()
}

/* ----------------------------------------------------------------
 * HELPERS
 * ----------------------------------------------------------------*/
function getEmptyUser() {
    return {
        _id: '',
        fullname: '',
        username: '',
        password: '',
        score: 0,
        isAdmin: false
    }
}

function saveLocalUser(user) {
    const minimalUser = {
        _id: user._id,
        fullname: user.fullname || 'Guest',
        isAdmin: !!user.isAdmin
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(minimalUser))
    return minimalUser
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)) || null
}
