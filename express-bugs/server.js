import express from 'express'
import cors from 'cors'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}

const app = express()
app.use(express.static('public'))
app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send('Hello there')
})

const port = 3030
app.listen(port, () => {
    loggerService.info(`Server ready at port ${port}`)
})

app.get('/api/bug', async (req, res) => {
    try {
        const bugs = await bugService.query()
        res.send(bugs)
    } catch (error) {
        loggerService.error('Error in /api/bug:', error);
        res.status(400).send('couldnt get bugs')
    }
})

app.get('/api/bug/save', async (req, res) => {
    try {
        const { _id, title, description, severity } = req.query
        const bugToSave = { _id, title, description, severity: +severity }
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (error) {
        loggerService.error('Error in /api/bug/save:', error);
        res.status(400).send('couldnt save bug')
    }
})

app.get('/api/bug/:bugId', async (req, res) => {
    try {
        const bugId = req.params.bugId
        const bug = await bugService.getById(bugId)
        if (!bug) throw new Error(`Bad bug id`)
        res.send(bug)
    } catch (error) {
        loggerService.error('Error in /api/bug/:bugId:', error);
        res.status(400).send('couldnt get bug')
    }
})

app.get('/api/bug/:bugId/remove', async (req, res) => {
    try {
        const bugId = req.params.bugId
        await bugService.remove(bugId)
        res.send('Removed')
    } catch (error) {
        loggerService.error('Error in /api/bug/:bugId/remove:', error);
        res.status(400).send('couldnt remove bug')
    }
})