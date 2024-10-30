const express = require('express')
const router = express.Router()
const authRouter = require('./auth')
const userRouter = require('./user')
const postRouter = require('./post')

router.use('/', authRouter)
router.use('/user', userRouter)
router.use('/post', postRouter)

module.exports = router;