import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import axios from 'axios'; 
import { useNavigate } from "react-router-dom"; 


function Profile(props) {
    const isAuth = props.isAuth; 
    const setIsAuth = props.setIsAuth;
    const signUserOut = props.signUserOut; 
    const [uid, setUid] = useState(localStorage.getItem("uid"))
    const [name, setName] = useState(localStorage.getItem("name"));
    const [email, setEmail] = useState(localStorage.getItem("email")); 
    const [user, setUser] = useState(`undefined`); 
    let navigate = useNavigate(); 
    
    useEffect(func => {
        if (!isAuth) {
            signUserOut();  
        }
        else {
            logIn(); 
        }
    }, [isAuth]);
    
    const logIn = async() => {
        axios.post('/api4/login', { uid: uid, name: name, email: email }).then(response => {
            console.log("Login response: " + Object.keys(response.data[0])); 
            console.log("cont: " + response.data[0].uid + ' ' + response.data[0].name + ' ' + response.data[0].email)
            console.log("decks: " + response.data[0].decks); 
            setEmail(response.data[0].email); 
            setName(response.data[0].name); 
            setUser(response.data[0]); 
            console.log("Login return: " + "{uid: " + uid + ", name: " + name + ", email: " + email)
        })
    };
    
    
    const delAccount = async() => {
        let decksToDelete = [];
        if (user.decks) {
            for (let i = 0; i < user.decks.length; i++) {
                decksToDelete.push(user.decks[i]); 
            }
            while (decksToDelete.length > 0) {
                let id = decksToDelete.pop(); 
                await axios.delete("/api4/deck/delete/" + id).then(console.log("deleted")); 
            }
        }
        axios.delete("/api4/usr/delete/" + uid).then(() => {
            console.log("redirect")
        }).catch((error) => console.log(error)); 
        signUserOut();
    }
    
    const postChanges = async() => {
        debugger; 
        console.log("request: " + "{uid:" + uid + ", name: " + name + ", email: " + email)
        axios.post("/api4/usr/profile", {uid: uid, name: name, email: email}).then(e => {
            console.log("Post return: " + Object.keys(e.data[0])); 
            setUser(e.data); 
            setName(e.data[0].name); 
            setEmail(e.data[0].email); 
            localStorage.setItem("name", e.data[0].name); 
            localStorage.setItem("email", e.data[0].email); 
        })
    }
    
    const deleteCheck = () => {
        if(window.confirm("This will permanantly delete your account and all associated decks. \nProceed?")) {
            console.log("deleting account")
            delAccount(); 
        }
    }
    
    const getUsers = async() => { //Delete
        console.log("get users"); 
        axios.get('/api4/usr').then(response => {
            console.log (response.data); 
        }); 
    }; 
    
    const postDebug = () => { //Delete
        console.log("User: " + user); 
        console.log("Name: " + name); 
        console.log("Email: " + email); 
        console.log("uid: " + uid); 
    }
    
    return (
    <div className="main">
        <div className="profile">
            <h2> Welcome {name} </h2>
            <input placeholder="Username" onChange={e => {setName(e.target.value)}} value={name} className="username" maxlength="30"></input>
            <input placeholder="Email" onChange={e => {setEmail(e.target.value)}} value={email} className="email" maxlength="40"></input>
            <button onClick={postChanges}> Save Changes </button> 
            <button onClick={deleteCheck}> Delete account </button>  
        </div>
        {/*<button onClick={postDebug}> Debug </button> 
        <button onClick={getUsers}> User </button> */}
    </div>
    ); 
}

export default Profile; 