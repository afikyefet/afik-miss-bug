import { storageService } from "../async-storage.service"




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
    return await storageService.query(STORAGE_KEY)
}
function getById(bugId) {
    return storageService.get(STORAGE_KEY, bugId)
}
function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}
async function save(bug) {
    console.log(bug);
    if (bug._id) {
        return await storageService.put(STORAGE_KEY, bug);
    } else {
        return await storageService.post(STORAGE_KEY, bug);
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