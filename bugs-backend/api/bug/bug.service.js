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

async function query() {
    try {
        return bugs;
    } catch (error) {
        loggerService.error(`Couldn't get bugs: ${error}`);
        throw error;
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

async function remove(bugId) {
    try {
        const idx = bugs.findIndex(bug => bug._id === bugId);
        if (idx === -1) throw new Error(`Bad bug id: ${bugId}`);
        bugs.splice(idx, 1);
        await writeJsonFile('./data/bugs.json', bugs);
    } catch (error) {
        loggerService.error(`Error in bugService.remove: ${error}`);
        throw error;
    }
}

async function save(bug) {
    try {
        if (bug._id) {
            const idx = bugs.findIndex(currBug => currBug._id === bug._id);
            if (idx === -1) throw new Error(`Bad bug id: ${bug._id}`);
            bugs.splice(idx, 1, bug);
        } else {
            bug._id = makeId();
            bugs.push(bug);
        }
        await writeJsonFile('./data/bugs.json', bugs);
        return bug;
    } catch (error) {
        loggerService.error(`Error in bugService.save: ${error}`);
        throw error;
    }
}
