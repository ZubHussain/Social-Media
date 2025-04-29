const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const {generateToken} = require('../utils/generateToken')

// User Signup Controller
const userSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email});
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const existingUsername = await User.findOne({ username});
    if (existingUsername) {
      return res.status(400).json({ message: "User already exists" }); 
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send(err.message);
        else {
          // Create a new user
          const newUser = await User.create({
            username,
            email,
            password: hash,
          });
          let token = generateToken(newUser);
          await newUser.save();
          res
            .status(201)
            .json({ message: "User registered successfully", user: newUser,token });
        }
      });
    });

  } catch (error) {
    res
      .status(500)
      .json({ message: "Error signing up user", error: error.message });
  }
};

// User Login Controller
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    let token = generateToken(user);
    
    res.status(200).json({ message: "Login successful", user ,token});
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const getUser = async(req,res)=>{
  try {
    const user = await User.findById(req.user._id).populate("posts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
}

const followUser = async(req,res)=>{
  try {
  const userToFollow = await User.findById(req.params.id)
  const currUser = await User.findById(req.user._id);
  
  
  if(!userToFollow || !currUser){
    return res.status(404).json({ message: "User not found" })
  }   
  if (currUser.following.includes(userToFollow._id)) {
    return res.status(400).json({ message: "Already following this user" });
  }
  currUser.following.push(userToFollow._id);
  userToFollow.followers.push(currUser._id);

  await currUser.save()
  await userToFollow.save()

  res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const unFollowUser =async(req,res)=>{
  try {
    const userToUnFollow = await User.findById(req.params.id)
    const currUser = await User.findById(req.user._id);

    if(!userToUnFollow || !currUser){
      return res.status(404).json({ message: "User not found" })
    }   
    currUser.following = currUser.following.filter(id => id.toString() !== userToUnFollow._id.toString())
    userToUnFollow.followers = userToUnFollow.followers.filter(id => id.toString() !== currUser._id.toString());

    await currUser.save();
    await userToUnFollow.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getFollowers = async(req,res)=>{
  try {
    const user = await User.findById(req.params.id).populate("followers", "name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ followers: user.followers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getFollowing  = async(req,res)=>{
  try {
    const user = await User.findById(req.params.id).populate("following", "username email");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ following: user.following });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const loggedInUserFriends = async(req,res)=>{
  try {
    // Get the authenticated user
    const currentUser = await User.findById(req.user._id).populate("followers following", "username email");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert followers and following arrays to sets
    const followersSet = new Set(currentUser.followers.map(user => user._id.toString()));
    const followingSet = new Set(currentUser.following.map(user => user._id.toString()));

    // Find mutual users (who are both in followers and following)
    const friends = currentUser.followers.filter(user => followingSet.has(user._id.toString()));

    res.status(200).json({ friends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getUserProfile = async(req,res)=>{
  try {
    const {userId} = req.params;
    const userProfile = await User.findById(userId).populate("posts").select('-password')
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const searchedUser = async(req,res)=>{
  try {
    const {query} = req.query
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
  }
   const users = await User.find(
        { username: { $regex: query, $options: "i" } },
  ).select("-password");

  res.status(200).json(users);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    const profilePicture = req.file ? `uploads/${req.file.filename}` : null;

    if (!profilePicture) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile picture updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { userSignup, userLogin ,getUser,followUser,unFollowUser,getFollowers,getFollowing,loggedInUserFriends,getUserProfile,searchedUser,uploadProfilePicture };
