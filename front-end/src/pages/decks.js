import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios"; 


function Decks({ isAuth }) {
    const [deckID, setDeckID] = useState([]);  
    const [deck, setDeck] = useState([]); 
    const [decks, setDecks] = useState([]); 
    const [up, setUp] = useState(false); 
    const [user, setUser] = useState(); 
    const [editor, setEditor] = useState(); 
    const [title, setTitle] = useState(); 
    const [list, setList] = useState(); 
    const [uid, setUid] = useState(localStorage.getItem("uid")); 
    const [edit, setEdit] = useState([]); 
    
    let navigate = useNavigate();
    
    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
        else {
            logIn(); 
            // getDecks(); 
        }
    }, []);
    
    useEffect(() => {
        makeDeck()
    }, [deck]); 
    
    useEffect(() => {
        if (decks) {
            upDeck();     
        }
    }, [decks]); 
    
    // useEffect(() => {
    //     setEdit(); 
    //     for (let i = 0; i < decks.length; i++) {
    //         setEdit(prevEdit => ([...prevEdit, false])); 
    //     }
    // }, [decks.length])
    
    const getUser = () => {
        console.log("User: " + user); 
        console.log("User decks: " + user[0].decks)
    }
    
    const getDecks = async() => {
        console.log("Get decks");
        axios.post('/api4/usr/decks', {"uid": uid}).then(response => {
            console.log(response.data); 
            setUser(response.data); 
            setDecks(user[0].decks); 
        }); 
    }; 
    
    const saveDeck = async() => {
        console.log("Save post"); 
        let uIN = uid; 
        let usrIn = { uid: uIN }; 
        axios.post('/api4/login', usrIn)
    }
  
    const getUsers = async() => {
        console.log("get users"); 
        axios.get('/api4/usr').then(response => {
            console.log (response.data); 
        }); 
    }; 
    
    const logIn = async() => {
        axios.post('/api4/login', { uid: uid }).then(response => {
            console.log(response.data); 
            setUser(response.data); 
            // console.log("DEBUG: " + response.data.decks); 
        })
    }; 
    
    const postDeck = async(event) => {
        event.preventDefault(); 
        console.log("Posting deck"); 
        axios.post("/api4/usr/deck", {name: title, cards: deck, uid: uid}).then(re => {
            console.log(re);
            setDeck([]); 
            setTitle(''); 
        }); 
    }; 
    
    const postDecks = async(event) => {
        event.preventDefault();
        let decksToDelete = []; 
        let currDecks = decks.map(e => e._id); 
        user[0].decks.forEach((e) => {
            let tmp = currDecks.indexOf(e._id); 
            if (tmp === -1) {
                decksToDelete.push(e._id); 
            }
        })
        console.log(decksToDelete); 
        while(decksToDelete.length !== 0) {
            let id = decksToDelete.pop(); 
            axios.delete("/api4/deck/delete" + id); 
        }
        for (let i of decks) {
            axios.post("/api4/deck/update", {cards: i.cards, _id: i._id})
        }
        axios.post("/api4/usr/update", {uid: uid, decks: decks}); 
    }
    
    const newCard = () => {
        setDeck(prevDeck => ([...prevDeck, {term: '', definition: ''}])); 
    }; 
    
    const newCards = (event) => {
        let deckIndex = event.target.dataset.deck; 
        let newDeck = decks.filter(e => true); 
        newDeck[deckIndex].cards.push({term: '', definition: ''}); 
        console.log(newDeck); 
        setDecks(newDeck); 
    }
    
    const logDeck = () => {
        console.log(deck); 
    }
    
    const logDecks = () => {
        console.log(decks); 
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
    
    const deleteCards = (event) => {
        console.log(event.target.value);
        let deckIndex = parseInt(event.target.dataset.deck, 10); 
        let cardIndex = parseInt(event.target.dataset.card, 10); 
        let newDecks = []; 
            for (let i = 0; i < decks.length; i++) {
                let tmp = (i === deckIndex) ? (decks[i].cards.filter((c, i_) => {
                    console.log(i_ === cardIndex); 
                    return(i_ !== cardIndex)})) : decks[i].cards; 
                console.log(tmp); 
                console.log(deckIndex + " === " + i); 
                console.log(i === deckIndex); 
                if (tmp.length !== 0) {
                    newDecks.push({name: decks[i].name, cards: tmp, _id: decks[i]._id, __v: decks[i].__v}); 
                }
            }
        console.log("New deck: " + newDecks[0]); 
        setDecks(newDecks); 
    }
    
    const deleteAllUSR = async() => {
        axios.delete("/api4/deleteall/usr"); 
    }
    const deleteAllDECKS = async() => {
        axios.delete("/api4/deleteall/decks"); 
    }
    
    //Sets term in the new deck
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
    
    //Sets terms in the user's decks
    const setTerms = (event) => {
        let deckIndex = parseInt(event.target.dataset.deck); 
        let cardIndex = parseInt(event.target.dataset.card); 
        console.log("Deck index: " + deckIndex); 
        console.log("Card index: " + cardIndex); 
        let newDecks = decks.map((e, i ) => {
            console.log("Is equal: " + deckIndex == i); 
            if (deckIndex === i) {
                return {_id: e._id, name: e.name, __v: e.__v, cards: 
                (decks[deckIndex].cards.map((c, i_) => {
                    if (i_ === cardIndex) {
                        return {term: event.target.value, definition: c.definition}; 
                    }
                    else {
                        console.log(c); 
                        return c; 
                    }
                }))}; 
            }
            else {
                return e; 
            }
        })
        console.log('New deck: ' + newDecks); 
        setDecks(newDecks); 
    }
    
    //Sets definitions in the new deck
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
    
    //Sets definitions in the user's decks
    const setDefs = (event) => {
        let deckIndex = parseInt(event.currentTarget.dataset.deck); 
        let cardIndex = parseInt(event.target.dataset.card); 
        console.log("Deck index: " + deckIndex); 
        console.log("Card index: " + cardIndex); 
        let newDecks = decks.map((e, i ) => {
            console.log("Is equal: " + deckIndex == i); 
            if (deckIndex === i) {
                return {_id: e._id, name: e.name, __v: e.__v, cards: 
                (decks[deckIndex].cards.map((c, i_) => {
                    if (i_ === cardIndex) {
                        return {term: c.term, definition: event.target.value}; 
                    }
                    else {
                        console.log(c); 
                        return c; 
                    }
                }))}; 
            }
            else {
                return e; 
            }
        })
        console.log('New deck: ' + newDecks); 
        setDecks(newDecks); 
    }
    
    //Automate and update
    
    const upDeck = () => {
        console.log("Is array deck? " + Array.isArray(decks)); //Debug
        
        setList(decks.map((item, index) => {
            return (<div key={item._id} className="deck">
                    <h1>{item.name}</h1>
                    <button> Show </button>
                    <button value={index}> Delete Deck </button>
                    <button value={index}> Edit Deck </button> 
                    {/*{item.cards.map(card => {
                        return (
                            <div className="card">
                                <p>{card.term}</p>
                                <p>{card.definition}</p> 
                            </div>
                        ); 
                    })}*/}
                    {item.cards.map((card,i)  => {
                        return(
                            <div className="card" key={decks[index]._id + i} data-deck={index} data-card={i}>
                                <input onChange={setTerms} value={decks[index].cards[i].term} data-deck={index} data-card={i}></input>
                                <input onChange={setDefs} value={decks[index].cards[i].definition} data-deck={index} data-card={i}></input>
                                <button type="button" onClick={deleteCards} data-deck={index} data-card={i}>Delete</button>
                            </div>
                        )
                    })}
                    <button type="button" onClick={newCards} data-deck={index}> Add card </button> 
                    <button value={index}> Save Deck </button> 
                </div>) ; 
        })); 
    }
    
    
    const makeDeck = () => {
        console.log("Update deck"); 
        setEditor(
            <form onSubmit={postDeck}>
                <input placeholder="Title" onChange={(event) => {setTitle(event.target.value)}} value={title}></input>
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
    
    const logList = () => {
        console.log(list); 
    }
    
    return (
        <div>
            Decks
            <button onClick={saveDeck}> Submit Post</button>
            <button onClick={getUsers}> Get Users </button>
            <button onClick={logIn}> Login </button>
            <button onClick={makeDeck}> New Deck </button> 
            <button onClick={logDeck}> Log Deck </button> 
            <button onClick={logDecks}> Log decks </button> 
            <button onClick={getDecks}> Get Decks </button> 
            <button onClick={getUser}> Get user </button> 
            <button onClick={logList}> Log List </button> 
            <button onClick={upDeck}> Up Decks </button> 
            {list ? list : "hi"}
            <button onClick={postDecks}> Save Decks </button> 
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