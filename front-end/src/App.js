import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/login";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import Decks from "./pages/decks"; 
import Footer from './comps/footer.js'; 
import Body from './comps/body.js'; 
import Profile from './pages/profile';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  return (
    <Router>
      <nav>
        <Link to="/"> Home </Link>

        {!isAuth ? (
          <Link to="/login"> Login </Link>
        ) : (
          <>
            <Link to="/decks"> Decks </Link>
            <Link to="/profile"> Profile </Link> 
            <button onClick={signUserOut}> Log Out</button>
          </>
        )}
      </nav>
      <Routes>
        <Route path='/' element={<Body />}/> 
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/decks" element={<Decks isAuth={isAuth} />} /> 
        <Route path="/profile" element={<Profile isAuth={isAuth} setIsAuth={setIsAuth} signUserOut={signUserOut}/>} /> 
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
