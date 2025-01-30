import "./App.css";
import About from "./components/about/About";
import FavouriteLikedPost from "./components/favourites/Favourite";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Navbar from "./components/navbar/Navbar";
import Postdetails from "./components/postdetails/Postdetails";
import Postform from "./components/postform/Postform";
import Postlist from "./components/postlist/Postlist";
import Register from "./components/register/Register";
import Settings from "./components/settings/Setting";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protect these routes, only accessible if logged in */}
          <Route path="/postdetails/:postId" element={<ProtectedRoute element={<Postdetails />} />} />
          <Route path="/postform" element={<ProtectedRoute element={<Postform />} />} />
          <Route path="/postlist" element={<ProtectedRoute element={<Postlist />} />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
          <Route path="/favliked" element={<ProtectedRoute element={<FavouriteLikedPost />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
