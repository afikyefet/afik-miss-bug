import { loggerService } from "./logger.service.js"
import { makeId, readJsonFile, writeJsonFile } from "./utils.js"

export const bugService = {
    query,
    getById,
    save,
    remove,
}


const bugs = readJsonFile('./data/bugs.json')

async function query() {
    try {
        return bugs
    } catch (error) {
        loggerService.error('couldnt get bugs' + error)
        throw error
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw new Error(`Bad bug id`)
        return bug
    } catch (error) {
        loggerService.error('couldnt get bug' + bugId + error)
        throw error
    }
}

async function remove(bugId) {
    try {
        const idx = bugs.findIndex(bug => bug._id === bugId)
        if (idx === -1) throw new Error(`Bad bug id`)
        bugs.splice(idx, 1)
        await writeJsonFile('./data/bugs.json', bugs)
    } catch (error) {
        loggerService.error('Error in bugService.remove:', error)
    }
}

async function save(bug) {
    try {
        if (bug._id) {
            const idx = bugs.findIndex(currBug => currBug._id === bug._id)
            if (idx === -1) throw new Error(`Bad bug id`)
            bugs.splice(idx, 1, bug)
        } else {
            bug._id = makeId()
            bugs.push(bug)
        }
        await writeJsonFile('./data/bugs.json', bugs)
        return bug
    } catch (error) {
        loggerService.error('Error in bugService.save:', error)
    }
}