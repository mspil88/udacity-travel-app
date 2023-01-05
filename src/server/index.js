const express = require("express");
const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const { moduleExpression } = require("@babel/types");
// dotenv.config();

//defining keys for submission purpose
const GEONAMES_USER_NAME = "infinite1861" 
const WEATHERBIT_API_KEY = "1128eea57b1f47628f05f8eb4f91cbeb"
const PIXABAY_API_KEY = "32234499-97b8e8b7f8d859ab839b15f28"
      
const PORT = 8081;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static("dist"));



const pixabayUrl = (location, minWidth, apiKey) => {
	return `https://pixabay.com/api/?key=${apiKey}&q=${location}&image_type=photo&orientation=horizontal&min_width=${minWidth}`;
};

const geoNamesUrl = (location, userName) => {
    return `http://api.geonames.org/searchJSON?name=${location}&maxRows=1&username=${userName}`
}

const weatherbitUrl = (longitude, latitude, weatherBitAPI) => {
    return `http://api.weatherbit.io/v2.0/forecast/daily?key=${weatherBitAPI}&lat=${latitude}&lon=${longitude}`;
}
//http://api.weatherbit.io/v2.0/forecast/daily?key=1128eea57b1f47628f05f8eb4f91cbeb&lat=48.85341&lon=2.3488

let geoNamesData = {}
let weatherBitData = {}
let pixabayData = {}


app.post("/userData", async (req, res) => {
    const {location} = req.body;
    console.log("REQ PARAMS")
    
    const data = await axios.post(geoNamesUrl(location, GEONAMES_USER_NAME))
    .then(response => {
        const {lng, lat, countryName} = response.data.geonames[0]
        geoNamesData = {longitude: lng,
                         latitude: lat,
                         country: countryName
        };

        return [lng, lat]
        
    })
    .then(response => {

        const [lng, lat] = response;
        let rv = axios.post(weatherbitUrl(lng, lat, WEATHERBIT_API_KEY),
                        )
        return rv
    })
    .then(response => {

        const city_name = response.data.city_name;
        const weather_data = response.data.data;
        weatherBitData = {city: city_name,
                          weather: weather_data
        }
        return city_name
    })
    .then(response => {
        let p_rv = axios.post(pixabayUrl(response, 1220, PIXABAY_API_KEY))
        console.log(p_rv)
        return p_rv;
    })
    .then(response => {
        pixabayData = {url: response.data.hits[0].largeImageURL}
        
        return;
    })
    .catch((error)=> {
        console.log(error)
    })
    res.send({msg: "done"})
})

app.get("/retrieveData", async (req, res) => {
    console.log("get route")
    console.log(geoNamesData)
    // console.log(weatherBitData)
    console.log(pixabayData)

    res.status(200).json([geoNamesData, weatherBitData, pixabayData])
})



app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`)
})

module.exports = PORT