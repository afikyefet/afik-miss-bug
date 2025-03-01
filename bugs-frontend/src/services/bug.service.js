
import axios, { Axios } from 'axios'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { httpService } from './http.service.js'

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
const BASE_URL = 'bug/'

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
    return await httpService.get(BASE_URL, { params: filterBy })
}
function getById(bugId) {
    return httpService.get(BASE_URL + bugId)
}
function remove(bugId) {
    return httpService.delete(BASE_URL + bugId)
}
async function save(bug) {
    console.log(bug);
    if (bug._id) {
        return await httpService.put(BASE_URL, bug);
    } else {
        return await httpService.post(BASE_URL, bug);
    }
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
    return { title: '', description: '', labels: [], severity: 0, pageIdx: undefined }
}