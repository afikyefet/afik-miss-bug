
import axios, { Axios } from 'axios'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

// const axios = Axios.create({
//     withCredentials: true
// })


const STORAGE_KEY = 'bugDB'
const BASE_URL = 'http://localhost:3333/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug
}


async function query() {
    const { data: bugs } = await axios.get(BASE_URL)
    console.log(bugs);

    return bugs
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}
function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
}
async function save(bug) {
    let response;
    if (bug._id) {
        response = await axios.put(BASE_URL, bug);
    } else {
        response = await axios.post(BASE_URL, bug);
    }
    return response.data;
}

function getEmptyBug() {
    return {
        title: '',
        description: '',
        labels: [],
        severity: null,
    }
}

function getDefaultFilter() {
    return { title: '', description: '', labels: [], severity: 0 }
}