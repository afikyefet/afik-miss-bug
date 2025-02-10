import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { loggerService } from './services/logger.service.js'
import {bugService} from './api/bug/bug.service.js'
import { addBug, getBug, getBugs, removeBug, updateBug } from './api/bug/bug.controller.js'
import { bugRoutes } from './api/bug/bug.routes.js'

const app = express()


const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}



app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

app.use('/api/bug', bugRoutes)

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = 3030
app.listen(port, () => {
    loggerService.info(`Server ready at port ${port}`)
})

