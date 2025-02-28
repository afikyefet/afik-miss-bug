
import axios, { Axios } from 'axios'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const myAxios = axios.create({
    withCredentials: true, // Send cookies with requests (if needed)
})


const labels = [
    "Critical",
    "High",
    "Medium",
    "Low",
    "Cosmetic",
    "UI/UX Issue",
    "Performance Issue",
    "Security Vulnerability",
    "Functional Bug"
]

const STORAGE_KEY = 'bugDB'
const BASE_URL = 'http://localhost:3333/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug,
    getLabelsList
}


async function query(filterBy = {}) {
    const { data: bugs } = await myAxios.get(BASE_URL, { params: filterBy })
    return bugs
}
function getById(bugId) {
    return myAxios.get(BASE_URL + bugId)
        .then(res => res.data)
}
function remove(bugId) {
    return myAxios.delete(BASE_URL + bugId)
        .then(res => res.data)
}
async function save(bug) {
    console.log(bug);

    let response;
    if (bug._id) {
        response = await myAxios.put(BASE_URL, bug);
    } else {
        response = await myAxios.post(BASE_URL, bug);
    }
    return response.data;
}

function getEmptyBug() {
    return {
        title: '',
        description: '',
        labels: [],
        severity: 0,
    }
}

function getRandomLabel() {
    return labels[Math.floor(Math.random() * labels.length)];
}

function getLabelsList() {
    return labels
}

function getDefaultFilter() {
    return { title: '', description: '', labels: [], severity: 0 }
}