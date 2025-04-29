const express = require('express')
const router = express.Router()
const {createPosts,getFriendsPosts} = require('../controllers/postController')
const {authMiddleware} = require('../middleware/isLoggedIn')
const upload = require('../config/multer')

router.post('/createPosts',authMiddleware,upload.single("media"),createPosts)

router.get('/friends/posts',authMiddleware,getFriendsPosts)
module.exports = router