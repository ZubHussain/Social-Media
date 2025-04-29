const express = require('express')
const router = express.Router()
const {userSignup,userLogin,getUser,followUser,unFollowUser, getFollowers,getFollowing,loggedInUserFriends,getUserProfile,searchedUser,uploadProfilePicture} = require('../controllers/userController') 
const {authMiddleware} = require('../middleware/isLoggedIn')
const upload = require("../config/multer");

router.post('/signup',userSignup)
router.post('/login',userLogin)
router.get('/profile',authMiddleware,getUser)
router.post('/follow/:id',authMiddleware,followUser)
router.post('/unFollow/:id',authMiddleware,unFollowUser)
router.get('/followers/:id',authMiddleware,getFollowers)
router.get('/following/:id',authMiddleware,getFollowing)
router.get('/friends',authMiddleware,loggedInUserFriends)
router.get('/search',authMiddleware,searchedUser)
router.get('/:userId',authMiddleware,getUserProfile)
router.post(
  "/uploadProfilePicture",
  authMiddleware,
  upload.single("profilePicture"),
  uploadProfilePicture
);

module.exports = router