import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios"; 


function Decks({ isAuth }) {
    const [deckID, setDeckID] = useState([]);  
    const [deck, setDeck] = useState([]); 
    const [decks, setDecks] = useState([]); 
    const [up, setUp] = useState(false); 
    const [us, setUs] = useState("user"); 
    const [editor, setEditor] = useState(); 
    const [title, setTitle] = useState(); 
    
    const auth = getAuth();
    const user = auth.currentUser;
    
    let navigate = useNavigate();
    
    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
        else {
            logIn(); 
        }
    }, []);
    
    useEffect(() => {
        makeDeck()
    }, [deck]); 
    
    const getDecks = async() => {
        console.log("Get decks");
        let uIN = user.uid;
        let usrIn = { uid: uIN }; 
        axios.post('/api4/login', usrIn).then((response) => {
            setDeckID(response.data.decks); 
            console.log(deckID); 
            let tmp = deckID.map((_id) => {
                axios.get('/api4/decks/' + _id).then(e => {
                    return e;  
                });
            });
            // setDeck(tmp); 
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
    }; 
    
    const postDeck = async(event) => {
        event.preventDefault(); 
        console.log("Posting deck"); 
        axios.post("/api4/usr/deck", {name: title, cards: deck, uid: user.uid}).then(re => {
            console.log(re);
        }); 
    }; 
    
    const newCard = () => {
        setDeck(prevDeck => ([...prevDeck, {term: '', definition: ''}])); 
    }; 
    
    const logDeck = () => {
        console.log(deck); 
    }
    
    const deleteCard = (event) => {
        let index = parseInt(event.target.value, 10); 
        console.log("index to cut: ", index); 
        console.log("array length: ", deck.length);
        let newDeck = deck.filter((e, i) => {
            return i !== index;   
        })
        
        console.log(newDeck); 
        setDeck(newDeck); 
    }
    
    const deleteAllUSR = async() => {
        axios.delete("/api4/deleteall/usr"); 
    }
    const deleteAllDECKS = async() => {
        axios.delete("/api4/deleteall/decks"); 
    }
    
    const setTerm = (event) => {
        let index = event.target.placeholder; 
        let newDeck = deck.map((e,i) => {
            console.log(e); 
            if (index == i) {
                return {term: event.target.value, definition: e.definition}; 
            }
            else {
                return e; 
            }
        })
        setDeck(newDeck); 
    }
    
    const setDef = (event) => {
        let index = event.target.placeholder; 
        console.log(index); 
        let newDeck = deck.map((e,i) => {
            console.log(e); 
            if (index == i) {
                return {term: e.term, definition: event.target.value};   
            }
            else {
                return e; 
            }
        })
        setDeck(newDeck); 
    }
    
    const makeDeck = () => {
        console.log("Update deck"); 
        setEditor(
            <form onSubmit={postDeck}>
                <input placeholder="Title" onChange={(event) => {setTitle(event.target.value)}}></input>
                {deck.map((e,i) => {
                    return (
                    <div className="card" key={i}>
                       <input placeholder={i} onChange={setTerm} index={i} value={deck[i].term}></input>
                       <input placeholder={i} onChange={setDef} index={i} value={deck[i].definition}></input>
                       <button type="button" onClick={deleteCard} value={i}>Delete</button>
                    </div>
                    )
                })}
                <button type="button" onClick={newCard}> New Card </button> 
                <button> Save </button> 
            </form>
            )
    }
  
    return (
        <div>
            Decks
            <button onClick={saveDeck}> Submit Post</button>
            <button onClick={getUsers}> Get Users </button>
            <button onClick={getUs}> {us.uid} </button>
            <button onClick={logIn}> Login </button>
            <button onClick={makeDeck}> New Deck </button> 
            <button onClick={logDeck}> Log Deck </button> 
            <h1>{title}</h1> 
            {editor}
            <p>{deck.length}</p>
            <p>{Array.isArray(deck) ? "is array" : "notArray"}</p>
            <div>
                Debug
                <button onClick={deleteAllUSR}> Delete all usrs </button> 
                <button onClick={deleteAllDECKS}> Delete all decks </button> 
            </div>
        </div>
        )
}

export default Decks