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

const weatherbitUrl = (longitude, latitude, weatherBitAPI) => {
    return `http://api.weatherbit.io/v2.0/forecast/daily?key=${weatherBitAPI}&lat=${latitude}&lon=${longitude}`;
}
//http://api.weatherbit.io/v2.0/forecast/daily?key=1128eea57b1f47628f05f8eb4f91cbeb&lat=48.85341&lon=2.3488
app.post("/userData", async (req, res) => {
    const location = req.body.location;
    // const data = await axios.post(geoNamesUrl(location, process.env.GEONAMES_USER_NAME))
    const data = await axios.post(geoNamesUrl(location, process.env.GEONAMES_USER_NAME))
    .then(response => {
        const {lng, lat, countryName} = response.data.geonames[0]
        return [lng, lat, countryName]
        
    })
    .then(data => {
        //res.send(data)
        console.log(data)

        let rv = axios.post(weatherbitUrl(data[0], data[1], process.env.WEATHER_BIT_API_KEY))
        return rv;
    })
    .then(res => {
        console.log(res.data.data)
    })

    // res.send({longitude: data[0], latitude: data[1], country: data[2]})
    // const {lng, lat, countryName} = data.data.geonames[0]
    // res.send({longitude: lng, latitude: lat, country: countryName})
    // return res.send({longitude: lng, latitude: lat, country: countryName})
        
})


app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`)
})