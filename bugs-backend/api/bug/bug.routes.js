import express from 'express'

const router = express.Router()

router.get('/api/bug', getBugs)
router.get('/api/bug/:bugId', getBug)
router.post('/api/bug', addBug)
router.put('/api/bug', updateBug)
router.delete('/api/bug/:bugId', removeBug)

export const bugRoutes = router