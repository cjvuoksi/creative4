import React from "react";
import { useState, useEffect} from 'react';
import axios from 'axios';



function Body() {
    const [update, setUpdate] = useState(false);     
	const [decks, setDecks] = useState([]); 
    //Return a list of decks by calling api
    const fetchDecks = async() => {
        //get all decks
        axios.get('api4/decks').then(response => {
            console.log(response.data); 
            setDecks(response.data); 
        }); 
    }
    
    
    
    
    return(
        <div>
            <a>HAHAHA</a>
            <button onClick={fetchDecks}>Fetch</button>
            <div>{decks.map(deck => {
                <p>{deck.name}</p>
            })
            }
            </div>
        </div>
    )
}

export default Body