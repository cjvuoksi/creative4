const express = require('express');

const router = express.Router(); 
const Decks = require('../db/models/deck');
const User = require('../db/models/user');

//Post Method
router.post('/decks/new', (req, res, next) => {
    Decks.create(req.body).then(function(deck){
        res.send(deck);
    }).catch(next);
});


//Get all Method
router.get('/decks',function(req,res,next){
    Decks.find({}).then(function(user){
        res.send(user);
    }).catch(next);
});

router.post('/login', (req,res,next) => {
    User.create(req.body).then(console.log(req.body)).catch(next); 
}); 


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