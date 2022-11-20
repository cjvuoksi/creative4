import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 


function Decks({ isAuth }) {
    const [deck, setDeck] = useState({name: '', about: '', creator: localStorage.getItem("name"), cards: []}); 
    const [ids, setId] = useState([]); 
    const [decks, setDecks] = useState([]); 
    const [user, setUser] = useState(); 
    const [editor, setEditor] = useState(); 
    const [list, setList] = useState(); 
    const [uid, setUid] = useState(localStorage.getItem("uid")); 
    const [name, setName] = useState(localStorage.getItem("name"));
    const [email, setEmail] = useState(localStorage.getItem("email")); 
    const [update, setUpdate] = useState(false); 
    
    let navigate = useNavigate();
    
    
    
    useEffect(func => {
        if (!isAuth) {
            navigate("/creative4/front-end/build/login");
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
        console.log("update effect")
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
    
    
    const logIn = async() => {
        await axios.post('/api4/login', { uid: uid, name: name, email: email }).then(response => {
            console.log("Login response: " + response.data[0].decks); 
            setUser(response.data); 
            setName(response.data[0].name); 
            setEmail(response.data[0].email);
            setUpdate(!update); 
            // console.log("DEBUG: " + response.data.decks); 
        })
    };
    
    const getUser = () => {
        console.log("User: " + user); 
        console.log("User decks: " + user[0].decks)
    }
    
    const getDecks = async() => {
        console.log("Get decks");
        axios.post('/api4/usr/decks', {"uid": uid}).then(async(response) => {
            console.log("User : " + Object.keys(response.data.decks)); 
            await setId(response.data.decks);
            let newDecks = []; 
            for (let i = 0; i < response.data.decks.length; i++) {
                axios.get('/api4/decks/' + response.data.decks[i]).then(res => {
                    newDecks.push(res.data); 
                    console.log("Decks up: " + Object.keys(res.data)); 
                    if (i === response.data.decks.length - 1 ) {
                        setDecks(newDecks); 
                    }
                }); 
            }
        }); 
    }; 

  
    const getUsers = async() => {
        console.log("get users"); 
        axios.get('/api4/usr').then(response => {
            console.log (response.data); 
        }); 
    }; 
    
     
    
    const postDeck = async(event) => { //Flag
        event.preventDefault();
        let title = deck.name ? deck.name : "blank"; 
        let desc = deck.about ? deck.about : "---"; 
        console.log("Posting deck: " + deck.name + ' ' + deck.about);
        axios.post("/api4/usr/deck", {'name': title, 'about': desc, 'edit': false, 'creator': deck.creator, 'cards': deck.cards,  'uid': uid}).then(re => {
            console.log(re);
            setDeck({name: '', about: '', creator: localStorage.getItem("name"), cards: []})
            setUpdate(!update); 
        }); 
    }; 
    
    const saveDeck = (e) => {
        let deckId = e.target.dataset.id; 
        let index = e.target.dataset.deck; 
        axios.post("/api4/deck/update", {'name': decks[index].name, 'about': decks[index].about, 'edit': false, 'creator': name, 'cards': decks[index].cards, _id: deckId}).then(re => {
            let newDecks = decks.filter(f => true);
            newDecks[index].edit = false; 
            setDecks(newDecks); 
            console.log(re); 
        })
    }
    
    const newCard = () => {
        let newDeck = JSON.parse(JSON.stringify(deck));
        newDeck.cards.push({term: '', definition: ''}); 
        setDeck(newDeck); 
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
        console.log(deck.name);
        console.log(deck.about); 
    }
    
    const logDecks = () => {
        for (let i of decks) {
            console.log("Objekt keys " + Object.keys(i)); 
            for (let j of Object.keys(i)) {
                console.log("Entry " + j + ": " + i.j)    
            }
        }
    }
    
    const deleteCard = (event) => { 
        let index = parseInt(event.target.value, 10); 
        console.log("index to cut: ", index); 
        console.log("array length: ", deck.length);
        let newDeck = JSON.parse(JSON.stringify(deck));
        newDeck.cards.splice(index, 1); 
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
    const setTerm = (event) => { //FLAG
        let index = event.target.dataset.index;
        console.log(index); 
        let newDeck = Object.assign({}, deck);
        newDeck.cards[index].term = event.target.value; 
        setDeck(newDeck); 
    }
    
    //Sets terms in the user's decks
    const setTerms = (event) => {
        let deckIndex = parseInt(event.target.dataset.deck); 
        let cardIndex = parseInt(event.target.dataset.card); 
        let newDecks = JSON.parse(JSON.stringify(deck));
        newDecks[deckIndex].cards[cardIndex].term = event.target.value; 
        setDecks(newDecks); 
        console.log("Term: " + newDecks[deckIndex].cards[cardIndex].term); 
    }
    
    //Sets definitions in the new deck
    const setDef = (event) => { 
        let index = event.target.dataset.index;
        console.log(index); 
        let newDeck = JSON.parse(JSON.stringify(deck));
        newDeck.cards[index].definition = event.target.value; 
        setDeck(newDeck); 
    }
    
    //Sets definitions in the user's decks
    const setDefs = (event) => {
        let deckIndex = parseInt(event.target.dataset.deck); 
        let cardIndex = parseInt(event.target.dataset.card); 
        let newDecks = decks.filter(f => true); 
        newDecks[deckIndex].cards[cardIndex].definition = event.target.value; 
        setDecks(newDecks); 
        console.log("Def: " + newDecks[deckIndex].cards[cardIndex].definition); 
    }
    
    const setTitle = (event) => {
        let newDeck = JSON.parse(JSON.stringify(deck));
        newDeck.name = event.target.value; 
        setDeck(newDeck); 
    }
    
    const setTitles = (e) => {
        let deckIndex = parseInt(e.target.dataset.deck, 10); 
        let newDecks = decks.filter(e => true); 
        newDecks[deckIndex].name = e.target.value;
        console.log(newDecks[deckIndex].name); 
        setDecks(newDecks); 
    }
    
    const setAbout = (event) => {
        let newDeck = JSON.parse(JSON.stringify(deck));
        newDeck.about = event.target.value; 
        setDeck(newDeck); 
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
        setDecks(newDecks); 
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
    
    const deleteDeck = async(e) => {
        let deckIndex = e.target.value; 
        let id = decks[deckIndex]._id;
        let newDecks = decks.filter(f => true); 
        newDecks.splice(deckIndex, 1);
        let newIds = ids.filter(f => true); 
        newIds.splice(deckIndex, 1); 
        console.log(newDecks); 
        if (window.confirm("This will permanantly delete " + decks[deckIndex].name + ".\n Are you sure?")) {
            console.log("Deleting ... " + decks[deckIndex].name)
            setDecks(newDecks);   
            setId(newIds); 
            axios.delete("/api4/deck/delete/" + id).then(q => {
                console.log(q); 
                axios.post("/api4/usr/update", {uid: uid, decks: newIds}).then(res => {
                    console.log(res); 
                    getDecks(); 
                });
            })
        }
        else {
            
        }
    }
    
    //Automate and update
    
    const upDeck = () => {
        setList(decks.map((item, index) => {
            return (<div key={item._id} className="deck">
                    {item.edit ? <input className="title" onChange={setTitles} value={decks[index].name} data-deck={index} placeholder="Title"></input> : <h1 className="title" >{item.name}</h1>}
                    {item.edit ? <input className="about" onChange={setAbouts} value={decks[index].about} data-deck={index} placeholder="About"></input> : <h3 className="about" ><i>{item.about}</i></h3>} 
                    <button value={index} onClick={setEdits}> Edit Deck </button> 
                    <button value={index} onClick={deleteDeck}> Delete Deck </button>
                    <div className="cards">
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
                                <input onChange={setTerms} value={decks[index].cards[i].term} data-deck={index} data-card={i} className="term" placeholder="Term"></input>
                                <input onChange={setDefs} value={decks[index].cards[i].definition} data-deck={index} data-card={i} className="definition" placeholder="Definition"></input>
                                <button type="button" onClick={deleteCards} data-deck={index} data-card={i} className="del-btn">╳</button>
                            </div>
                        ); 
                        }
                    })}
                    </div>
                    {item.edit ? <button type="button" onClick={saveDeck} data-deck={index} data-id={item._id}>Save</button> : ''}
                    {item.edit ? <button type="button" onClick={newCards} data-deck={index} className="add-btn">+</button> : ''} 
                </div>) ; 
        })); 
    }; 
    
    
    const makeDeck = () => {
        console.log("Update deck"); 
        setEditor(
            <form onSubmit={postDeck} className="deck">
                <input placeholder="Title" onChange={setTitle} value={deck.name} className="title"></input>
                <input placeholder="Deck description" onChange={setAbout} value={deck.about} className="about"></input>
                {deck.cards.map((e,i) => {
                    return (
                    <div className="card" key={i}>
                       <input placeholder="Term" onChange={setTerm} data-index={i} value={deck.cards[i].term} className="term"></input>
                       <input placeholder="Definition" onChange={setDef} data-index={i} value={deck.cards[i].definition} className="definition"></input>
                       <button type="button" onClick={deleteCard} value={i} className="del-btn">╳</button>
                    </div>
                    ); 
                })}
                <button type="button" onClick={newCard} className="add-btn">+</button> 
                <button> Save </button> 
            </form>
            ); 
    }; 
    
    const logList = () => {
         
        console.log("User: " + user);
        console.log("Ids: " + ids); 
        console.log("Decks: " + decks); 
        console.log("Deck: " + deck); 
    }; 
    
    return (
        <div className="main">
            Decks 
            <button onClick={saveDeck}> Submit Post</button>
            <button onClick={getUsers}> Get Users </button>
            <button onClick={logIn}> Login </button>
            <button onClick={makeDeck}> New Deck </button> 
            <button onClick={logDeck}> Log Deck </button> 
            <button onClick={logDecks}> Log decks </button>
            <button onClick={getUser}> Get user </button> 
            <button onClick={logList}> Log List </button> 
            <button onClick={upDeck}> Up Decks </button>
            <button onClick={deleteAllDECKS}> Delete all decks </button>
            <button onClick={deleteAllUSR}> Delete all users </button> 
            
            <button onClick={getDecks} title="reload" className="refresh">&#128472;</button> 
            {decks.length !== 0 ? list : <p className="alert">Oops! No decks found. Create a new one below</p> }
            {editor}
        </div>
        ); 
}

export default Decks; 