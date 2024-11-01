const express = require('express')
const authRouter = require('./auth')
const userRouter = require('./user')
const postRouter = require('./post')

const router = express.Router()

router.use('/', authRouter)
router.use('/user', userRouter)
router.use('/post', postRouter)

module.exports = router;