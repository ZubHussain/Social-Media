const Post = require('../models/postModel');
const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;
const connectCloudinary  = require('../config/cloudinary');
const fs = require('fs');

connectCloudinary(); 

const createPosts = async (req, res) => {
  try {
    let { content } = req.body;
    const userId = req.user._id;

    let mediaUrl = null;

    // ✅ Upload image to Cloudinary if file exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'posts', // optional folder name in Cloudinary
        resource_type: 'auto', // allows images, videos, etc.
      });

      mediaUrl = result.secure_url;

      // Optional: delete file from local uploads folder after upload
      fs.unlinkSync(req.file.path);
    }

    // ✅ Create new post
    const newPost = await Post.create({
      userId,
      content,
      media: mediaUrl,
    });

    // ✅ Add post ID to user's posts array
    await User.findByIdAndUpdate(userId, {
      $push: { posts: newPost._id },
    });

    res
      .status(201)
      .json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating post', error: error.message });
  }
};

// ✅ Get friends’ posts (unchanged)
const getFriendsPosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).populate(
      'followers following',
      'username'
    );

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followingSet = new Set(
      currentUser.following.map((user) => user._id.toString())
    );

    const FriendsIds = currentUser.followers
      .filter((user) => followingSet.has(user._id.toString()))
      .map((user) => user._id);

    const FriendsPosts = await Post.find({ userId: { $in: FriendsIds } }).populate(
      'userId',
      'username profilePicture'
    );

    res.status(200).json({ posts: FriendsPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPosts, getFriendsPosts };
