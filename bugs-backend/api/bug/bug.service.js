import { loggerService } from "../../services/logger.service.js";
import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js";

export const bugService = {
    query,
    getById,
    save,
    remove,
};

let bugs;
try {
    bugs = readJsonFile('./data/bugs.json');
} catch (error) {
    loggerService.error(`Failed to read bugs.json: ${error}`);
    bugs = [];
}

async function query(filterBy = {}) {
    try {
        let filteredBugs = bugs
        if (filterBy.title && filterBy.title.trim()) {
            const titleLower = filterBy.title.toLowerCase()
            filteredBugs = filteredBugs.filter(bug =>
                bug.title && bug.title.toLowerCase().includes(titleLower)
            )
        }
        if (filterBy.description && filterBy.description.trim()) {
            const descLower = filterBy.description.toLowerCase()
            filteredBugs = filteredBugs.filter(bug =>
                bug.description && bug.description.toLowerCase().includes(descLower)
            )
        }
        if (filterBy.severity !== undefined && filterBy.severity !== null && filterBy.severity !== "") {
            const severityNum = +filterBy.severity
            filteredBugs = filteredBugs.filter(bug =>
                +bug.severity >= severityNum
            )
        }
        if (filterBy.labels && filterBy.labels.length) {
            filteredBugs = filteredBugs.filter(bug => {
                if (!bug.labels || !Array.isArray(bug.labels)) return false
                return filterBy.labels.every(label => bug.labels.includes(label))
            })
        }
        if (filterBy.sortBy) {
            filteredBugs.sort((a, b) => {
                const aVal = a[filterBy.sortBy] !== undefined ? a[filterBy.sortBy] : 0
                const bVal = b[filterBy.sortBy] !== undefined ? b[filterBy.sortBy] : 0
                if (aVal < bVal) return filterBy.descending ? 1 : -1
                if (aVal > bVal) return filterBy.descending ? -1 : 1
                return 0
            })
        }
        return filteredBugs
        return bugs
    } catch (error) {
        loggerService.error(`Couldn't get bugs: ${error}`)
        throw error
    }
}



async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId);
        if (!bug) throw new Error(`Bad bug id: ${bugId}`);
        return bug;
    } catch (error) {
        loggerService.error(`Couldn't get bug with id ${bugId}: ${error}`);
        throw error;
    }
}

async function remove(bugId, loggedinUser) {
    try {
        const bugToRemove = await getById(bugId)
        if (!loggedinUser.isAdmin && bugToRemove?.owner?._id !== loggedinUser._id) throw 'Cant remove bug'
        const idx = bugs.findIndex(bug => bug._id === bugId);
        if (idx === -1) throw new Error(`Bad bug id: ${bugId}`);
        bugs.splice(idx, 1);
        await writeJsonFile('./data/bugs.json', bugs);
    } catch (error) {
        loggerService.error(`Error in bugService.remove: ${error}`);
        throw error;
    }
}

async function save(bug, loggedinUser) {
    try {
        if (bug._id) {
            if (!loggedinUser.isAdmin && bug?.owner?._id !== loggedinUser._id) throw 'Cant save bug'
            const idx = bugs.findIndex(currBug => currBug._id === bug._id);
            if (idx === -1) throw new Error(`Bad bug id: ${bug._id}`);
            // bugs.splice(idx, 1, bug);
            bugs[idx] = bug
        } else {
            bug._id = makeId();
            bug.createdAt = Date.now()
            bug.creator = {
                _id: loggedinUser._id,
                fullname: loggedinUser.fullname
            }
            bugs.push(bug);
        }
        await writeJsonFile('./data/bugs.json', bugs);
        return bug;
    } catch (error) {
        loggerService.error(`Error in bugService.save: ${error}`);
        throw error;
    }
}
