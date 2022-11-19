import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 


function Decks({ isAuth }) {
    const [deck, setDeck] = useState([]); 
    const [decks, setDecks] = useState([]); 
    const [user, setUser] = useState(); 
    const [editor, setEditor] = useState(); 
    const [title, setTitle] = useState(); 
    const [about, setAbout] = useState(); 
    const [list, setList] = useState(); 
    const [uid, setUid] = useState(localStorage.getItem("uid")); 
    const [name, setName] = useState(localStorage.getItem("name"));
    const [email, setEmail] = useState(localStorage.getItem("email")); 
    const [update, setUpdate] = useState(false); 
    
    let navigate = useNavigate();
    
    const logIn = async() => {
        axios.post('/api4/login', { uid: uid, name: name, email: email }).then(response => {
            console.log(response.data); 
            setUser(response.data); 
            setName(response.data[0].name); 
            setEmail(response.data[0].email);
            setUpdate(!update); 
            // console.log("DEBUG: " + response.data.decks); 
        })
    };
    
    useEffect(func => {
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
    
    useEffect(() => {
        if (decks) {
            upDeck();     
        }
    }, [decks]); 
    
    useEffect(() => {
        getDecks();
    }, [update]); 
    
    useEffect(() => {
        localStorage.setItem("name", name); 
    }, [name])
    
    useEffect(() => {
        localStorage.setItem("email", email); 
    }, [email])
    
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
    
     
    
    const postDeck = async(event) => {
        event.preventDefault(); 
        console.log("Posting deck"); 
        axios.post("/api4/usr/deck", {name: title, about: about, edit: false, creator: name, cards: deck,  uid: uid}).then(re => {
            console.log(re);
            setDeck([]); 
            setTitle('');
            setAbout(''); 
            setUpdate(!update); 
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
            axios.post("/api4/deck/update", {cards: i.cards, _id: i._id, name: i.name, about: i.about, creator: name}); 
        }
        let newDecks = decks.filter(e => true);
        newDecks.forEach(e => {
            e.edit = false; 
        })
        setDecks(newDecks);
        axios.post("/api4/usr/update", {uid: uid, decks: decks}).then(res => {
            console.log(res); 
            getDecks(); 
        })
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
                    newDecks.push({name: decks[i].name, about: decks[i].about, creator: decks[i].creator, cards: tmp, _id: decks[i]._id, __v: decks[i].__v}); 
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
                return {name: e.name, about: e.about, creator: e.creator, edit: e.edit, _id: e._id, __v: e.__v, cards: 
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
                return {name: e.name, about: e.about, creator: e.creator, edit: e.edit, _id: e._id, __v: e.__v, cards: 
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
    
    const setTitles = (e) => {
        let deckIndex = parseInt(e.target.dataset.deck, 10); 
        let newDecks = decks.filter(e => true); 
        newDecks[deckIndex].name = e.target.value;
        console.log(newDecks[deckIndex].name); 
        setDecks(newDecks); 
    }
    
    const setAbouts = (e) => {
        let deckIndex = parseInt(e.target.dataset.deck, 10); 
        let newDecks = decks.filter(e => true); 
        newDecks[deckIndex].about = e.target.value;
        console.log(newDecks[deckIndex].about); 
        setDecks(newDecks); 
    }
    
    const setEdits = (e) => {
        let deckIndex = parseInt(e.target.value, 10); 
        let newDecks = decks.filter(e => true); 
        newDecks[deckIndex].edit = !newDecks[deckIndex].edit; 
        console.log(newDecks[deckIndex].edit); 
        setDeck(newDecks); 
        logEdits(); 
        upDeck(); 
    }
    
    const toggleClass = (e) => {
        e.currentTarget.classList.toggle("hide-deck"); 
    }
    
    const logEdits = () => {
        let edits = [];
        for (let i of decks) {
            edits.push(i.edit); 
        }
        console.log(edits); 
    }
    
    const toggleTerm = (e) => {
        for (let item of e.currentTarget.children) {
            item.classList.toggle("hidden"); 
        }
    }
    
    const deleteDeck = (e) => {
        console.log()
        let deckIndex = e.target.value; 
        let newDeck = decks.filter(t => true);
        newDeck.splice(deckIndex, 1); 
        setDecks(newDeck); 
    }
    
    //Automate and update
    
    const upDeck = () => {
        console.log("Is array deck? " + Array.isArray(decks)); //Debug
        
        setList(decks.map((item, index) => {
            return (<div key={item._id} className="deck">
                    {item.edit ? <input className="title" onChange={setTitles} value={decks[index].name} data-deck={index}></input> : <h1 className="title">{item.name}</h1>}
                    {item.edit ? <input className="about" onChange={setAbouts} value={decks[index].about} data-deck={index}></input> : <h3 className="about"><i>{item.about}</i></h3>} 
                    <button value={index} onClick={setEdits}> Edit Deck </button> 
                    <button value={index} onClick={deleteDeck}> Delete Deck </button>
                    {/*<div onClick={toggleClass} className={"hide-deck " + "cards"}><a>◺</a>*/}
                    {item.cards.map((card,i) => {
                        if (!item.edit) {
                        return (
                            <div className="card" onClick={toggleTerm} key={decks[index]._id + i}>
                                <p className="term">{card.term}</p>
                                <p className={"hidden " + "definition"}>{card.definition}</p> 
                            </div>
                        ); 
                        }
                    })}
                    {item.cards.map((card,i)  => {
                        if (item.edit) {
                        return(
                            <div className="card" key={decks[index]._id + i} data-deck={index} data-card={i}>
                                <input onChange={setTerms} value={decks[index].cards[i].term} data-deck={index} data-card={i} className="term"></input>
                                <input onChange={setDefs} value={decks[index].cards[i].definition} data-deck={index} data-card={i} className="definition"></input>
                                <button type="button" onClick={deleteCards} data-deck={index} data-card={i}>Delete</button>
                            </div>
                        ); 
                        }
                    })}
                    {item.edit ? <button type="button" onClick={newCards} data-deck={index}> Add card </button> : ''} 
                    {item.edit ? <button onClick={postDecks}> Save Deck </button> : ''}
                </div>) ; 
        })); 
    }; 
    
    
    const makeDeck = () => {
        console.log("Update deck"); 
        setEditor(
            <form onSubmit={postDeck} className="deck">
                <input placeholder="Title" onChange={(event) => {setTitle(event.target.value)}} value={title} className="title"></input>
                <input placeholder="Deck description" onChange={(e) => setAbout(e.target.value)} value={about} className="about"></input>
                {deck.map((e,i) => {
                    return (
                    <div className="card" key={i}>
                       <input placeholder={i} onChange={setTerm} index={i} value={deck[i].term} className="term"></input>
                       <input placeholder={i} onChange={setDef} index={i} value={deck[i].definition} className="definition"></input>
                       <button type="button" onClick={deleteCard} value={i} className="del-btn">&#735;</button>
                    </div>
                    ); 
                })}
                <button type="button" onClick={newCard} className="add-btn">+</button> 
                <button> Save </button> 
            </form>
            ); 
    }; 
    
    const logList = () => {
        console.log(list); 
    }; 
    
    return (
        <div className="main">
            Decks
            {/*<button onClick={saveDeck}> Submit Post</button>
            <button onClick={getUsers}> Get Users </button>
            <button onClick={logIn}> Login </button>
            <button onClick={makeDeck}> New Deck </button> 
            <button onClick={logDeck}> Log Deck </button> 
            <button onClick={logDecks}> Log decks </button> */}
            <button onClick={getDecks}>&#128472;</button> 
            {/*<button onClick={getUser}> Get user </button> 
            <button onClick={logList}> Log List </button> 
            <button onClick={upDeck}> Up Decks </button> */}
            {decks.length !== 0 ? <button onClick={postDecks}>Save Changes</button> : ''}
            {decks.length !== 0 ? list : <p className="alert">Oops! No decks found. Create a new one below</p> }
            {editor}
        </div>
        ); 
}

export default Decks; 