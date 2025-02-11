import express from 'express'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser';
import { loggerService } from './services/logger.service.js'
import { bugRoutes } from './api/bug/bug.routes.js'

const app = express()


const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/bug', bugRoutes)

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = 3333
app.listen(port, () => {
    loggerService.info(`Server ready at port ${port}`)
})

