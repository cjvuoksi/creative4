const express = require('express');
const debug = require('debug')("set-a:"); 
const router = express.Router(); 
const Decks = require('../db/models/deck');
const User = require('../db/models/user');

//Post Method
// router.post('/decks/new', (req, res, next) => {
//     Decks.create(req.body).then(function(deck){
//         debug("deck: " + deck); 
//         res.send(deck);
//     }).catch(next);
// });

router.post('/usr/deck', (req, res) => {
    debug("Request: " + Object.keys(req.body)); 
    debug("uid: " + req.body.uid); 
    Decks.create(req.body).then(e => {
        debug("E: " + e);
        debug("uid: " + req.body.uid); 
        User.updateOne({"uid": req.body.uid}, {$push: {"decks": e}}).then(re => res.send(re)); 
    }); 
})

router.post('/usr/decks', (req, res) => {
    User.find({"uid": req.body.uid}).then(user => {
        res.send(user); 
    })
}); 

//Get all Methods
router.get('/decks',function(req,res,next){
    Decks.find({}).then(function(deck){
        debug("deck:" + deck); 
        debug("is array? " + Array.isArray(deck)); 
        res.send(deck);
    }).catch(next);
});


router.get('/usr',function(req,res,next){
    User.find({}).then(function(user){
        res.send(user);
    }).catch(next);
});

router.post('/login', (req, res, next) => { //Make this call once on the deck page (useEffect)
    debug("Request: " + Object.keys(req.body));
    debug("UID: " + req.body.uid); 
    User.countDocuments({"uid": req.body.uid }).then(count => {
        debug(count); 
        if (count > 0) {
            debug("Welcome back!"); 
            User.find({ uid: req.body.uid }).limit(1).size().then(usr => res.send(usr)); 
        }
        else {
            User.create(req.body).then((response) => { 
                debug(req.body);
                debug("New User"); 
                res.send(response.data);
            }).catch(next); 
        }
    }); 
    
});

router.delete("/deck/delete/:id", (req, res) => {
    let id = req.params.id; 
    debug("Id: " + id); 
    Decks.deleteOne({'_id': id}).then(e => debug("Deleted one deck")); 
})

router.post("/usr/update", (req, res) => {
    User.updateOne({'uid': req.body.uid},{$set:{ decks: req.body.decks}}).then(e => debug(e)); 
})

router.post("/deck/update", (req, res) => {
    Decks.updateOne({'_id': req.body._id},{$set:{ cards: req.body.cards}}).then(e => debug(e)); 
})

router.post("/deck/")

router.delete('/deleteall/usr', (req, res) => {
    User.deleteMany({}).then(e => debug("Deleted all users")); 
})

router.delete('/deleteall/decks', (req, res) => {
    Decks.deleteMany().then(e => debug("Deleted all decks")); 
    User.updateMany({},{$set:{ decks: []}}).then(e => debug(e)); 
}); 

router.post('/decks', (req, res) => {
    
})


/*Todo 
Make a create a new deck that posts to the signed in user
    - adds the deck ID to the currently logged in user decks array
Remove the extra user profiles / give db set behavior for users
Make api calls to edit a deck by deck id 
    - gets a deck by deck ID and edits its children by id? or perhaps a modify
        - look into mongodb/mongoose for this

*/


//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send('Get by ID API')
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})

module.exports = router;