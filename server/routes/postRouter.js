const express = require('express')
const router = express.Router()
const {createPosts,getFriendsPosts} = require('../controllers/postController')
const {authMiddleware} = require('../middleware/isLoggedIn')
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/createPosts',authMiddleware,upload.single("image"),createPosts)

router.get('/friends/posts',authMiddleware,getFriendsPosts)
module.exports = router