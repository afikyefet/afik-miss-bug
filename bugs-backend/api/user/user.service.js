import { loggerService } from "../../services/logger.service.js";
import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js";
import fs from 'fs';

export const userService = {
    query,
    getById,
    save,
    remove,
    getByUsername
};

let users;
try {
    users = readJsonFile('./data/users.json');
} catch (error) {
    loggerService.error(`Failed to read users.json: ${error}`);
    users = [];
}

async function query(filterBy = {}) {
    try {
        return users
    } catch (error) {
        loggerService.error(`Couldn't get users: ${error}`)
        throw error
    }
}

async function getByUsername(username) {
    try {
        const user = users.find(user => user.username === username)
        return user
    } catch (err) {
        loggerService.error('userService[getByUsername] : ', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const user = users.find(user => user._id === userId);
        if (!user) throw new Error(`Bad user id: ${userId}`);

        return user;
    } catch (error) {
        loggerService.error(`Couldn't get user with id ${userId}: ${error}`);
        throw error;
    }
}

async function remove(userId) {
    try {
        const idx = users.findIndex(user => user._id === userId);
        if (idx === -1) throw new Error(`Bad user id: ${userId}`);
        users.splice(idx, 1);
        await writeJsonFile('./data/users.json', users);
    } catch (error) {
        loggerService.error(`Error in userService.remove: ${error}`);
        throw error;
    }
}

async function save(user) {
    try {
        let savedUser = user
        if (savedUser._id) {
            const idx = savedUser.findIndex(currUser => currUser._id === savedUser._id);
            if (idx === -1) throw new Error(`Bad user id: ${savedUser._id}`);
            users.splice(idx, 1, user);
        } else {
            user._id = makeId();
            user.score = 1000
            user.isAdmin = false
            users.push(user);
        }
        // await writeJsonFile('./data/users.json', users);
        return _saveUsersToFile().then(() => user)
    } catch (error) {
        loggerService.error(`Error in userService.save: ${error}`);
        throw error;
    }
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {

        const usersStr = JSON.stringify(users, null, 2)
        fs.writeFile('data/users.json', usersStr, (err) => {
            if (err) {
                return console.log(err);
            }
            resolve()
        })
    })
}