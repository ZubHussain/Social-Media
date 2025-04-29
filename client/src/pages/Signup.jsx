import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';


function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3000/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        
        if (response.ok) {
          console.log('Signup successful:', data);
          navigate('/login')
          
        } else {
          console.error('Signup failed:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
    <div className="max-w-md w-full bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/30">
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-white text-sm font-semibold">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/70"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-white text-sm font-semibold">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/70"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-white text-sm font-semibold">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/70"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className=" cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-purple-600 transition duration-300"
        >
          Sign Up
        </button>
      </form>
      <p className="text-center text-white mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-300 underline hover:text-purple-500">
            Login
          </Link>
        </p>
    </div>
  </div>
  );
}

export default Signup;