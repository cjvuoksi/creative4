const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const router = express.Router(); 

module.exports = router;



const PORT = 3004; 

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//CHANGE DB NAME TODO

mongoose.connect(`mongodb://127.0.0.1:27017/study`);
mongoose.Promise = global.Promise;

app.use(express.static('public'));

app.use(express.json());

app.use('/api4', routes); 


app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
}); 

