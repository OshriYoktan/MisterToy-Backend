const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getUser, getUsers, deleteUser, updateUser, login, addUser, logout } = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/login/:user', login)
router.put('/logout', logout)
router.put('/:id', updateUser)
router.put('/:id', requireAuth, updateUser)
router.post('/signUp/:user', addUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)

module.exports = router