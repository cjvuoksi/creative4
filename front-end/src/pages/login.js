import React from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios"; 

function Login({ setIsAuth }) {
  let navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      localStorage.setItem("uid", getAuth().currentUser.uid); 
      localStorage.setItem("email", getAuth().currentUser.email);
      localStorage.setItem("name",getAuth().currentUser.displayName);
      setIsAuth(true);
      navigate("/");
    });
  };

  return (
    <div className="main">
      <p>Sign In With Google to Continue</p>
      <button className="login-with-google-btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;