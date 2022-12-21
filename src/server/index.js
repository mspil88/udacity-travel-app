const express = require("axios");
const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 8081;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static("dist"));


app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`)
})