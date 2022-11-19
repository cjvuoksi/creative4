import { useState, useEffect} from 'react';
import axios from 'axios';



function Body() {
	const [decks, setDecks] = useState([]); 
	const [list, setList] = useState([]); 
    //Return a list of decks by calling api
    const fetchDecks = async() => {
        //get all decks
        axios.get('/api4/decks').then(response => {
            console.log("response: " + response.data); 
            setDecks(response.data); 
        }).catch((error) => {
            console.log(error); 
            alert("Server not running"); 
        }); 
    }; 
    
    useEffect(() => {upDeck()}, [decks]); 
    useEffect(() => {fetchDecks()}, []); 

    const toggleTerm = (e) => {
        for (let item of e.currentTarget.children) {
            item.classList.toggle("hidden"); 
        }
    }; 
    
    const upDeck = () => {
        setList(decks.map(deck => {
            return (<div key={deck._id}>
                        <h1>{deck.name}</h1>
                        <h3><i>{deck.about}</i></h3> 
                        <h3><i>Created by {deck.creator}</i></h3>
                        <div className="cards">
                            {deck.cards.map(card => {
                                return (
                                    <div className="card" onClick={toggleTerm}>
                                        <p className="term">{card.term}</p>
                                        <p className={"hidden " + "definition"}>{card.definition}</p> 
                                    </div>
                                ); 
                            })}
                        </div> 
                    </div>); 
        }))
    }
    
    const logDecks = () => {
        console.log(decks); 
    }
    
    const logList = () => {
        console.log(list); 
    }
    
    
    return(
        <div className="main">
            <button onClick={fetchDecks} title="reload" className="refresh">&#128472;</button>
            <div>
                {list}
            </div>
        </div>
    )
}

export default Body