import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import OtherUserProfile from './pages/OtherUserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/userProfile/:userId" element={<OtherUserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
