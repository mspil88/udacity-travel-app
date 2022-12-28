const express = require("express");
const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
dotenv.config();

const PORT = 8081;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static("dist"));




const geoNamesUrl = (location, userName) => {
    return `http://api.geonames.org/searchJSON?name=${location}&maxRows=1&username=${userName}`
}

app.post("/userData", async (req, res) => {
    const location = req.body.location;
    const data = await axios.post(geoNamesUrl(location, process.env.GEONAMES_USER_NAME))
    const {lng, lat, countryName} = data.data.geonames[0]
    res.send({longitude: lng, latitude: lat, country: countryName})
})


app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`)
})