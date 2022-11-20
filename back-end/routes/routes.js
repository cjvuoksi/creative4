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
        User.updateOne({"uid": req.body.uid}, {$push: {"decks": e._id}}).then(re => res.send(re)); 
    }); 
})

router.post('/usr/decks', (req, res) => {
    User.findOne({"uid": req.body.uid}, {decks: 1}).then(user => {
        debug(user); 
        res.send(user); 
    })
}); 

router.post('/deck/update', (req, res) => {
    debug("id: " + req.body._id); 
    Decks.replaceOne({"_id": req.body._id}, { name: req.body.name, about: req.body.about, edit: false, creator: req.body.creator, cards: req.body.cards }).then(re => {
        debug("Re: " + Object.keys(re)); 
        res.send(re); 
    })
})

//Get all Methods
router.get('/decks',function(req,res,next){
    Decks.find({}).then(function(deck){
        debug("deck:" + deck); 
        debug("is array? " + Array.isArray(deck)); 
        res.send(deck);
    }).catch(next);
});

router.get('/decks/:id', (req, res) => {
    Decks.findOne({'_id': req.params.id}).then((deck) => {
        res.send(deck); 
    })
})


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
            User.find({ uid: req.body.uid }).then(usr => res.send(usr)); 
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
    if (id != 'undefined') {
    Decks.deleteOne({'_id': id}).then(e => {
        debug("Deleted one deck: " + id);
        res.send(e); 
    });
    }
    else {
        res.send("Id undefined"); 
    }
})

router.post("/usr/update", (req, res) => {
    User.updateOne({'uid': req.body.uid},{$set:{ decks: req.body.decks}}).then((e) => debug(e)); 
})

router.post("/usr/profile", (req, res) => {
    User.updateOne({"uid": req.body.uid}, {$set:{ name: req.body.name, email: req.body.email}}).then((e) => {
        User.find({'uid': req.body.uid}).then(re => {
            res.send(re); 
        }); 
    }); 
}); 

router.post("/deck/update", (req, res) => {
    Decks.updateOne({'_id': req.body._id},{$set:{ cards: req.body.cards, name: req.body.name, about: req.body.about, edit: false, creator: req.body.creator}}).then(e => debug(e)); 
})

router.delete("/usr/delete/:uid", (req, res) => {
    debug("UID to delete: " + req.params.uid); 
    User.deleteMany({'uid': req.params.uid}).then(e => {
        debug(e); 
        res.send(e); 
    }).catch(err => {
        res.send(err); 
    })
}); 



//Delete All
router.delete('/deleteall/usr', (req, res) => {
    User.deleteMany({}).then(e => debug("Deleted all users")); 
})

router.delete('/deleteall/decks', (req, res) => {
    Decks.deleteMany().then(e => debug("Deleted all decks")); 
    User.updateMany({},{$set:{ decks: []}}).then(e => debug(e)); 
}); 



module.exports = router;