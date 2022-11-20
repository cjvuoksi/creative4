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
      window.location.pathname = "/creative4/front-end/build/";
    });
  };

  //basename="creative4/front-end/build"
  return (
    <Router basename="creative4/front-end/build">
      <nav className="nav-bar">
        <Link to="/" className="nav-link"> Home </Link>

        {!isAuth ? (
          <Link to="/login" className="nav-link"> Login </Link>
        ) : (
          <>
            <Link to="/decks" className="nav-link"> My Decks </Link>
            <Link to="/profile" className="nav-link"> Profile </Link> 
            <Link onClick={signUserOut} className={"nav-link " + "logout"}> Log Out</Link>
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
