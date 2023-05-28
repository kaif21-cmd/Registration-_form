const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect("mongodb://127.0.0.1:27017/registration", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connection to MongoDB successful"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const db = mongoose.connection;
db.on('error', () => console.error("Error connecting to the database"));
db.once('open', () => console.log("Connected to the database"));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.post("/signup", (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;

  const newUser = new User({
    name: name,
    email: email,
    phone: phone,
    password: password
  });

  newUser.save()
    .then(() => {
      console.log("User saved successfully");
      return res.redirect('signup_success.html');
    })
    .catch((err) => {
      console.error("Error saving user:", err);
      return res.status(500).send("Error saving user");
    });
});

app.get("/", (req, res) => {
  res.send("Hello from Kaif");
  return res.redirect('index.html');
});

app.listen(8003, () => {
  console.log("Server is running on port 3000");
});
