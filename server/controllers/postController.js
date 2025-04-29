const Post = require('../models/postModel')
const User = require('../models/userModel')

const createPosts = async(req,res)=>{
    try {
        let {content} = req.body
        const media = req.file ? `uploads/${req.file.filename}` : null; 
        const userId = req.user._id
        const newPost = await Post.create({
            userId:userId,
            content,
            media
        })
        await User.findByIdAndUpdate(userId, {
            $push: { posts: newPost._id },
          });
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res
        .status(500)
        .json({ message: "Error signing up user", error: error.message });
    }
}

const getFriendsPosts = async (req, res) => {
    try {
      // Get the authenticated user
      const currentUser = await User.findById(req.user._id).populate("followers following", "username");
  
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Convert followers and following arrays to sets
      const followersSet = new Set(currentUser.followers.map((user) => user._id.toString()));
      const followingSet = new Set(currentUser.following.map((user) => user._id.toString()));
  
      // Find mutual friends (users who are both in followers and following)
      const FriendsIds = currentUser.followers
        .filter((user) => followingSet.has(user._id.toString()))
        .map((user) => user._id);
  
      // Fetch posts created by mutual friends
      const FriendsPosts = await Post.find({ userId: { $in: FriendsIds } }).populate(
        "userId",
        "username profilePicture"
      );
  
      res.status(200).json({ posts: FriendsPosts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
module.exports = {createPosts,getFriendsPosts}