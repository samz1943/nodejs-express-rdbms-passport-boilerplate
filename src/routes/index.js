const express = require('express')
const router = express.Router()
const authRouter = require('./auth')
const userRouter = require('./user')

router.use('/', authRouter)
router.use('/users', userRouter)

module.exports = router;