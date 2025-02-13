import { loggerService } from "../../services/logger.service.js";
import { bugService } from "./bug.service.js";

export async function getBugs(req, res) {
  try {
    const { title, severity, description, labels, sortBy, descending } = req.query
    const filterBy = {
      title,
      severity: severity ? +severity : undefined,
      description,
      labels: labels ? labels.split(',') : [],
      sortBy,
      descending: descending === 'true'
    }
    const bugs = await bugService.query(filterBy)
    res.send(bugs)
  } catch (err) {
    loggerService.error('Cannot get bugs', err)
    res.status(400).send('Cannot get bugs')
  }
}

export async function getBug(req, res) {
  try {
    const { bugId } = req.params;

    let visitedBugIds = req.cookies.visitedBugIds || [];
    if (!visitedBugIds.includes(bugId)) visitedBugIds.push(bugId);
    console.log(visitedBugIds);

    if (visitedBugIds.length > 3) return res.status(403).send('Wait for a bit');
    res.cookie('visitedBugIds', visitedBugIds, { maxAge: 1000 * 100 });
    const bug = await bugService.getById(bugId);
    res.send(bug);
  } catch (err) {
    res.status(400).send('Couldn\'t get bug', err);
  }
}


export async function addBug(req, res) {
  try {
    const { title, description, severity, labels = [] } = req.body
    const bugToSave = { title, description, labels, severity: +severity }
    const savedBug = await bugService.save(bugToSave)
    res.send(savedBug)
  } catch (err) {
    loggerService.error('Cannot add bug', err)
    res.status(400).send('Cannot add bug')
  }
}

export async function updateBug(req, res) {
  try {
    const { _id, title, description, severity, labels = [] } = req.body
    const bugToSave = { _id, title, labels, description, severity: +severity }
    const savedBug = await bugService.save(bugToSave)
    res.send(savedBug)
  } catch (err) {
    loggerService.error('Cannot update bug', err)
    res.status(400).send('Cannot update bug')
  }
}

export async function removeBug(req, res) {
  try {
    const { bugId } = req.params
    await bugService.remove(bugId)
    res.send('Bug removed')
  } catch (err) {
    loggerService.error('Cannot remove bug', err)
    res.status(400).send('Cannot remove bug')
  }
}