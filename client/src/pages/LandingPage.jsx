import React, { useState, useEffect } from "react";
import { FaSearch, FaBell, FaEnvelope, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import isAuth from "../hooks/useAuth";

const Sidebar = ({ user }) => {
  const menuItems = ["Discover", "Trendings", "Explore", "Bookmarks", "Groups", "Pages", "Stages", "Games"];
  const [activeItem, setActiveItem] = useState("Discover");

  return (
    <aside className="w-64 p-4 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-12 h-12 bg-gray-500 rounded-full">
          <img src="https://encrypted-tbn0.gstatic.com/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRONGYaOP-OSc1cbnEzGvYJEuDcC0oPWcX5mw&s?q=tbn:ANd9GcS_6uuCrRxlAdfJV-3GQD5fSs0a69xvVDXmjKb8FBc-w7SDgyYKgI7oM0hhtuV4wC4PTC0&usqp=CAU" alt="" 
          className="w-12 h-12 rounded-full"/>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            <a href="/profile">{user?.username || "Loading..."}</a>
          </h2>
          <p className="text-xs text-gray-300">{user?.bio || "Creative Artist"}</p>
        </div>
      </div>
      <nav>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item}
              className={`p-2 rounded-lg cursor-pointer text-white ${
                activeItem === item ? "bg-gradient-to-r from-purple-500 to-indigo-600" : "hover:bg-white/10"
              }`}
              onClick={() => setActiveItem(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const TopNav = () => {
  const [search, setSearch] = useState(""); // Search input value
  const [results, setResults] = useState([]); // Search results
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate(); // For navigation

  const searchUsers = async () => {
    if (!search) {
      setResults([]); // Clear results if search is empty
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://3.145.132.212:3000/user/search?query=${search}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setResults(data); // Set the search results
        setError("");
      } else {
        setError("Failed to fetch search results");
        setResults([]);
      }
    } catch (error) {
      setError("Failed to fetch search results",error);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-1/3 flex">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 pl-10 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-300" />
        <button
          onClick={searchUsers}
          className="cursor-pointer ml-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition duration-300"
        >
          Search
        </button>

        {/* Search Results Dropdown */}
        {search && (
          <div className="absolute w-full bg-white text-black mt-12 rounded-lg shadow-lg">
            {loading && <p className="p-2">Loading...</p>}
            {error && <p className="p-2 text-red-500">{error}</p>}
            {!loading && results.length === 0 && !error && <p className="p-2">No results found</p>}
            {results.map((user) => (
              <div
                key={user._id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => navigate(`/userProfile/${user._id}`)} // Navigate to the user's profile
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={user.profilePicture || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <p>{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex space-x-4 text-white">
        <FaEnvelope className="cursor-pointer hover:text-purple-400" />
        <FaBell className="cursor-pointer hover:text-purple-400" />
      </div>
    </div>
  );
};

const CreatePostModal = ({ isOpen, onClose }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("media", image);
    }

    try {
      const response = await fetch("http://3.145.132.212:3000/post/createPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Post created successfully:", data);
        setContent("");
        setImage(null);
        onClose(); // Close the modal after successful post creation
      } else {
        console.error("Error creating post:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-black w-96">
        <h2 className="text-xl font-semibold text-black mb-4">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white/30 text-black placeholder-gray-300 border border-black focus:outline-none focus:ring-2 focus:ring-black"
            ></textarea>
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-black"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition duration-300"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FeaturedPosts = () => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchFriendsPosts = async () => {
      try {
        // fetch logged In users posts
        const userResponse = await fetch("http://3.145.132.212:3000/user/profile",{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = await userResponse.json();
        

        // Fetch friends posts
        const friendsResponse = await fetch("http://3.145.132.212:3000/post/friends/posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const friendsdata = await friendsResponse.json();

        if (userResponse.ok && friendsResponse.ok) {
          const combinedPosts = [...userData.user.posts,...friendsdata.posts]
          combinedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPosts(combinedPosts); // Set the posts data
        } else {
          console.error("Error fetching mutual friends' posts:");
        }
      } catch (error) {
        console.error("Error fetching mutual friends' posts:", error);
      }
    };

    fetchFriendsPosts();
  }, []);

  return (
    <>
      <h2 className="text-lg text-center font-semibold text-white mb-4">Feed</h2>
    <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 h-99 w-full overflow-y-auto flex flex-col items-center">
      {posts.length > 0 ? (
        posts.map((post, i) => (
          <div key={i} className="mb-4 bg-white/20 p-4 rounded-lg shadow-md w-120 max-w-md">
            <div className="flex items-center space-x-2 mb-2">
              <img
                src={post.userId?.profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_6uuCrRxlAdfJV-3GQD5fSs0a69xvVDXmjKb8FBc-w7SDgyYKgI7oM0hhtuV4wC4PTC0&usqp=CAU"}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <p className="text-sm text-white font-semibold">{post.userId?.username}</p>
            </div>
            <p className="text-sm text-green-800 mb-2">{post.content}</p>
            {post.media && (
              <img
                src={`http://localhost:3000/${post.media}`}
                alt="Post Media"
                className="w-full h-80 object-contain rounded-lg"
              />
            )}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-300">No posts from mutual friends to show.</p>
      )}
    </div>
  </>
  );
};

const RightSidebar = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://3.145.132.212:3000/user/friends", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log(data.friends);
        
        if (response.ok) {
          setFriends(data.friends);
        } else {
          console.error("Error fetching user data:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);
  return (
    <aside className="w-64 p-4 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30">
      <h2 className="text-lg font-semibold text-white mb-4">Suggested Groups</h2>
      <div className="w-full h-24 bg-white/20 rounded-lg mb-6 shadow-lg border border-white/30"></div>
      <h2 className="text-lg font-semibold text-white mb-4">Friends</h2>
      {friends.map((friend, i) => (
        <div key={i} className="flex items-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-gray-500 rounded-full">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCVGBYJmbgnCaXQ4l3eUIhSOs41J4MDCKMnA&s://encrypted-tbn0.gstatic.com/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRONGYaOP-OSc1cbnEzGvYJEuDcC0oPWcX5mw&s?q=tbn:ANd9GcS_6uuCrRxlAdfJV-3GQD5fSs0a69xvVDXmjKb8FBc-w7SDgyYKgI7oM0hhtuV4wC4PTC0&usqp=CAU" alt="" 
          className="w-12 h-12 rounded-full"/>
          </div>
          <div>
            <p className="text-sm text-white cursor-pointer" onClick={()=>navigate(`/userProfile/${friend._id}`)} >{friend.username}</p>
            <p className="text-xs text-gray-300">{friend.role}</p>
          </div>
        </div>
      ))}
    </aside>
  );
};

const Dashboard = () => {
  isAuth();
  const [user, setUser] = useState(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://3.145.132.212:3000/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          console.error("Error fetching user data:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => setIsCreatePostOpen(false);

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
      <Sidebar user={user} />
      <main className="flex-1 p-6">
        <TopNav />
        <div className="flex justify-start mb-6">
          <button
            onClick={openCreatePost}
            className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:opacity-90 transition duration-300"
          >
            <FaPlus /> Create Post
          </button>
        </div>
        <CreatePostModal isOpen={isCreatePostOpen} onClose={closeCreatePost} />
        <FeaturedPosts />
      </main>
      <RightSidebar />
    </div>
  );
};

export default Dashboard;
