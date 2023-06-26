const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mtech2023', {useNewUrlParser: true}); // "userManagement" is the db name
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('db connected');
});

const userSchema = new mongoose.Schema({
  name: String,
  role: String,
  // age: { type: Number, min: 18, max: 70 },
  createdDate: { type: Date, default: Date.now }
});

const collectionName = 'user';
const user = mongoose.model('userCollection', userSchema, collectionName);

app.post('/newUser', async (req, res) => {
  console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
  const newUser = new user();
  newUser.name = req.body.name;
  newUser.role = req.body.role;
  try {
      let aUser = await newUser.save();
      console.log(`new user save: ${aUser}`);
      res.send(`done ${aUser}`);
  } catch (err) {
      console.error(err);
      res.send(`error: ${err}`);
  }
});

app.get('/user/:name', async (req, res) => {
  let requestName = req.params.name;
  try {
    let aUser = await user.findOne({ name: requestName }) 
    console.log(`user name: ${aUser}\n`)
    res.send(`found ${aUser}`);
  }
  catch (err) {
    console.log(err)
  }
});

app.post('/updateUserRole', async (req, res) => {
  console.log(`POST /updateUserRole: ${JSON.stringify(req.body)}`);
  let matchedName = req.body.name;
  let newrole = req.body.role;
  try {
    let data = await user.findOneAndUpdate( {name: matchedName}, {role: newrole}, { new: true }) //return the updated version instead of the pre-updated document
    let returnMsg = 'Not Found'
    if(data) {
      returnMsg = `user name : ${matchedName} New role : ${data.role}`;
      console.log(returnMsg);
    }
    res.send(returnMsg);
  }  
  catch (err) {
    console.log(err)
  };
})

app.post('/removeUser', async (req, res) => {
  console.log(`POST /removeUser: ${JSON.stringify(req.body)}`);
  let matchedName = req.body.name;
  try {
    let data = await user.findOneAndDelete({ name: matchedName })
    let returnMsg = "Not Found"
    if(data) {
      returnMsg = `user name : ${matchedName}, removed data : ${data}`;
      console.log(returnMsg);
    }
    res.send(returnMsg);

  }
  catch (err) {
    console.log(err)
  }
});


app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`App Server listen on port: ${port}`);
});
