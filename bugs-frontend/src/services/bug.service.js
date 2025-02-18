
import axios, { Axios } from 'axios'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'


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
    const { data: bugs } = await axios.get(BASE_URL, { params: filterBy })
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