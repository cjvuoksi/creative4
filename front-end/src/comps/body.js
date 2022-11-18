import React from "react";
import { useState, useEffect} from 'react';
import axios from 'axios';



function Body() {
    const [update, setUpdate] = useState(false);     
	const [decks, setDecks] = useState([]); 
	const [list, setList] = useState([]); 
    //Return a list of decks by calling api
    const fetchDecks = async() => {
        //get all decks
        axios.get('api4/decks').then(response => {
            console.log("response: " + response.data); 
            setDecks(response.data); 
            setUpdate(true); 
        }).catch((error) => {
            console.log(error); 
            alert("Server not running"); 
        }); 
    }
    
    useEffect(() => {upDeck()}, [decks])

    const toggleTerm = (e) => {
        e.target.children.forEach(e => {
            e.classList.toggle("hidden"); 
        })
    }
    
    const upDeck = () => {
        setList(decks.map(deck => {
            return (<div key={deck._id}>
                    <h1>{deck.name}</h1>
                    <p><i>{deck.about}</i></p> 
                    <button> Show </button>
                    {deck.cards.map(card => {
                        return (
                            <div className="card" onClick={toggleTerm}>
                                <p>{card.term}</p>
                                <p className="hidden">{card.definition}</p> 
                            </div>
                        ) 
                    })}
                </div>) 
        }))
    }
    
    const logDecks = () => {
        console.log(decks); 
    }
    
    const logList = () => {
        console.log(list); 
    }
    
    
    return(
        <div>
            <a>HAHAHA</a>
            <button onClick={fetchDecks}>Fetch</button>
            <button onClick={logDecks}> Log Decks </button> 
            <button onClick={logList}> Log List </button> 
            <button onClick={upDeck}> Calls updeck </button> 
            <div>
                {list}
            </div>
        </div>
    )
}

export default Body