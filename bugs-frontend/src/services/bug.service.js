
import axios, { Axios } from 'axios'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const axios = Axios.create({
    withCredentials: true
})


const STORAGE_KEY = 'bugDB'
const BASE_URL = 'http://localhost:3030/api/bug/'

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

    return bugs
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}
function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
        .then(res => res.data)
}
async function save(bug) {
    const queryStrParams = 'save?' + Object.keys(bug).map(key => `${key}=${bug[key]}`).join('&')
    return await axios.get(BASE_URL + queryStrParams)
        .then(res => res.data)
}

function getEmptyBug(){
    return {
        title: '',
        description: '',
        labels: [],
        severity: null,
    }
}

function getDefaultFilter(){
    return {title: '', description: '', labels: [], severity: 0}
}