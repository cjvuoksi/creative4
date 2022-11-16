import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios"; 


function Decks({ isAuth }) {
    const [deckID, setDeckID] = useState([]);  
    const [deck, setDeck] = useState([]); 
    const [up, setUp] = useState(false); 
    const [us, setUs] = useState("user"); 
    
    const auth = getAuth();
    const user = auth.currentUser;
    
    let navigate = useNavigate();
    
    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    }, []);
    
    const getDecks = async() => {
        console.log("Get decks");
        let uIN = user.uid;
        let usrIn = { uid: uIN }; 
        axios.post('/api4/login', usrIn).then((response) => {
            setDeckID(response.data.decks); 
            let tmp = deckID.map((id) => {
                axios.get('/api4/decks/' + id).then(e => {
                    return e;  
                });
            });
            setDeck(tmp); 
        }); 
    }; 
    
    const saveDeck = async() => {
        console.log("Save post"); 
        let uIN = user.uid; 
        let usrIn = { uid: uIN }; 
        axios.post('/api4/login', usrIn)
    }
  
    const getUsers = async() => {
        console.log("get users"); 
        axios.get('/api4/usr').then(response => {
            console.log (response.data); 
        })
    }
  
    const getUs = () => {
        setUs(user); 
    }
    
    const logIn = async() => {
        axios.post('/api4/login', { uid: user.uid}).then(response => console.log(response.data)); 
    }
  
    return (
        <div>
            Decks
            <button onClick={saveDeck}> Submit Post</button>
            <button onClick={getUsers}> Get Users </button>
            <button onClick={getUs}> {us.uid} </button>
            <button onClick={logIn}> Login </button>
        </div>
        )
}

export default Decks