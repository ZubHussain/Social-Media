/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Camera, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const OtherUserProfile = () => {
  useAuth(); // Check authentication
  const [user, setUser] = useState();
  const [isFollowing, setIsFollowing] = useState(false); // State to track if the user is already followed
  const { userId } = useParams();
  const navigate = useNavigate();

  // Fetch user data from the API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://3.145.132.212:3000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          const sortedPosts = data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setUser({ ...data, posts: sortedPosts });

          // Check if the logged-in user is already following this user
          const loggedInUser = await fetch("http://3.145.132.212:3000/user/profile", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const loggedInUserData = await loggedInUser.json();
          if (loggedInUserData.user.following.includes(userId)) {
            setIsFollowing(true);
          }
        } else {
          console.error("Error fetching user data:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [userId]);

  // Follow user
  const followUser = async () => {
    try {
      const response = await fetch(`http://3.145.132.212:3000/user/follow/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (response.ok) {

        setIsFollowing(true); // Update the state to reflect the follow action
      } else {
        console.error("Error following user:", data);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // Unfollow user
  const unfollowUser = async () => {
    try {
      const response = await fetch(`http://3.145.132.212:3000/user/unFollow/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        console.log("User unfollowed successfully:", data);
        setIsFollowing(false); // Update the state to reflect the unfollow action
      } else {
        console.error("Error unfollowing user:", data);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <Card className="w-full max-w-4xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/landingPage")} // Navigate back to the previous page
          className="absolute cursor-pointer top-4 left-4 flex items-center gap-2 px-3 py-2 text-sm bg-white/20 text-white rounded-lg shadow-md hover:bg-white/30 transition duration-300"
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>

        {/* Follow/Unfollow Button */}
        <div className="absolute top-4 right-4 flex gap-3">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              className={`cursor-pointer flex items-center gap-2 px-3 py-2 text-sm ${
                isFollowing ? "text-gray-500 border-gray-400" : "text-white border-blue-500 bg-blue-500"
              }`}
              onClick={isFollowing ? unfollowUser : followUser} // Toggle between follow and unfollow
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </motion.div>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mt-8">
          <div className="relative w-32 h-32">
            <img
              src={
                user?.profilePicture ||
                "https://i.seadn.io/s/primary-drops/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/809912:about:media:b85aff06-a8eb-4806-a9b1-3f6ab73b957c.jpeg?auto=format&dpr=1&w=1500"
              }
              alt="Profile"
              className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
            />
           
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">{user?.username || "Loading..."}</h1>
          <p className="text-gray-300">{user?.email || "Loading..."}</p>
        </div>

        {/* Stats Section */}
        <CardContent className="mt-8 space-y-4 text-center">
          <p className="text-gray-200 italic">"Just another dreamer exploring the world one step at a time."</p>
          <div className="grid grid-cols-3 gap-6 text-center">
            {["Posts", "Followers", "Following"].map((label, index) => (
              <div key={index} className="bg-white/20 p-4 rounded-lg shadow-md">
                <p className="text-2xl font-bold text-white">{user?.[label.toLowerCase()]?.length || 0}</p>
                <p className="text-gray-300">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>

        {/* Posts Section */}
        <CardContent className="mt-8 overflow-y-auto h-[80vh]">
          <h2 className="text-2xl font-semibold text-white mb-6">Your Posts</h2>
          <div className="grid grid-cols-3 gap-6">
            {user?.posts?.length > 0 ? (
              user.posts.map((post) => (
                <motion.div
                  key={post._id}
                  className="bg-white/20 p-4 rounded-lg shadow-md border border-white/30 flex flex-col h-85 w-55"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => window.open(`http://localhost:3000/${post.media}`, "_blank")}
                >
                  {post.media && (
                    <div className="relative w-full h-100 overflow-hidden rounded-lg">
                      <img
                        src={`http://localhost:3000/${post.media}`}
                        alt="Post Media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-300">You have no posts yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtherUserProfile;
