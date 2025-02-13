
import axios, { Axios } from 'axios'

const STORAGE_KEY = 'userDB'
const BASE_URL = 'http://localhost:3333/api/user/'

export const userService = {
    query,
    getById,
    save,
    remove,
    getEmptyUser,
}


async function query() {
    const { data: users } = await axios.get(BASE_URL)
    return users
}
function getById(userId) {
    return axios.get(BASE_URL + userId)
        .then(res => res.data)
}
function remove(userId) {
    return axios.delete(BASE_URL + userId)
        .then(res => res.data)
}
async function save(user) {
    let response;
    if (user._id) {
        response = await axios.put(BASE_URL, user);
    } else {
        user.score = 100
        response = await axios.post(BASE_URL, user);
    }
    return response.data;
}

function getEmptyUser() {
    return {
        fullname: '',
        username: '',
        password: '',
        score: 0,
    }
}
