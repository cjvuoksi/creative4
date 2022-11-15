import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";



function Decks({ isAuth }) {
    
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.GetToken(); 
    let navigate = useNavigate();
    
    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    }, []);
    
    const saveDeck = async() => {
        console.log("Save post"); 
        
    }
  
  
    return (
        <div>
            Decks
            <button onClick={saveDeck}> Submit Post</button>
        </div>
        )
}

export default Decks