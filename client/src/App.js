import './App.css';
import About from './components/about/About';
import FavouriteLikedPost from './components/favourites/Favourite';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Navbar from './components/navbar/Navbar';
import Postdetails from './components/postdetails/Postdetails';
import Postform from './components/postform/Postform';
import Postlist from './components/postlist/Postlist';
import Register from './components/register/Register';
import Settings from './components/settings/Setting';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/postdetails/:postId" element={<Postdetails />} />
        <Route path="/postform" element={<Postform />} />
        <Route path="/postlist" element={<Postlist />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/favliked" element={<FavouriteLikedPost />} />
      </Routes>
    </Router>
  );
}

export default App;
