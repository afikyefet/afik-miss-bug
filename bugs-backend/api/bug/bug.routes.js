import express from 'express'
import { addBug, getBug, getBugs, removeBug, updateBug } from './bug.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', log, getBug)
router.post('/', requireAuth, addBug)
router.put('/', requireAuth, updateBug)
router.delete('/:bugId', requireAuth, removeBug)

export const bugRoutes = router