const express = require("express");
const app = express();
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;

app.get("/", (req, res) => res.send("Hello World"));
const port = process.env.PORT || 5000;

// tell Express to start a socket and listen for connections on the path.
app.listen(port, () => console.log(`Server is running on port ${port}`));

// node app in terminal willl start the server

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));