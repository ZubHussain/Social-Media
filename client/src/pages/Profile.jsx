/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Edit, Camera, LogOut,ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const UserProfile = () => {
  useAuth(); // Check authentication
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user posts from the API
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          // Sort posts by createdAt in descending order
          const sortedPosts = data.user.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setUser({ ...data.user, posts: sortedPosts });
        } else {
          console.error("Error fetching user data:", data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const openModal = ()=>{
    setIsOpen(true)
  }

  const closeModal = ()=>{
    setIsOpen(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <Card className="w-full max-w-4xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/landingPage')} // Navigate back to the previous page
          className="absolute cursor-pointer top-4 left-4 flex items-center gap-2 px-3 py-2 text-sm bg-white/20 text-white rounded-lg shadow-md hover:bg-white/30 transition duration-300"
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>

        {/* Edit and Logout Buttons */}
        <div className="absolute top-4 right-4 flex gap-3">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="outline" className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm"
            onClick={openModal}>
              <Edit size={14} /> Edit Profile
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-red-600 border-red-500 hover:bg-red-100"
              onClick={handleLogout}
            >
              <LogOut size={14} /> Logout
            </Button>
          </motion.div>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mt-8">
          <div className="relative w-32 h-32">
            <img
              src={user?.profilePicture || "https://i.seadn.io/s/primary-drops/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/809912:about:media:b85aff06-a8eb-4806-a9b1-3f6ab73b957c.jpeg?auto=format&dpr=1&w=1500"}
              alt="Profile"
              className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
            />
            <motion.button
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:scale-110"
              whileHover={{ scale: 1.2 }}
            >
              <Camera size={16} className="text-gray-700"  />
            </motion.button>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">{user?.username || "Loading..."}</h1>
        </div>
        {/* Stats Section */}
        <CardContent className="mt-8 space-y-4 text-center">
          <p className="text-gray-200 italic">{user?.bio}</p>
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

      {/* Edit Profile Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                defaultValue={user?.username}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <input
                type="text"
                defaultValue={user?.bio}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal} // Close the modal
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};

export default UserProfile;