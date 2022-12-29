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
app.post("/userData", async (req, res) => {
    const location = req.body.location;
    // const data = await axios.post(geoNamesUrl(location, process.env.GEONAMES_USER_NAME))
    const data = await axios.post(geoNamesUrl(location, process.env.GEONAMES_USER_NAME))
    .then(response => {
        const {lng, lat, countryName} = response.data.geonames[0]
        return [lng, lat, countryName, location]
        
    })
    .then(data => {
        //res.send(data)
        console.log(data)
        const [lng, lat, countryName, location] = data;
        let rv = axios.post(weatherbitUrl(lng, lat, process.env.WEATHER_BIT_API_KEY),
                        )
        // return [rv, location, countryName];
        return rv
    })
    .then(res => {
        const city_name = res.data.city_name;
        const weather_data = res.data.data;
        let p_rv = axios.post(pixabayUrl(city_name, 1220, process.env.PIXABAY_API_KEY))
        return p_rv
    })
    .then(r => {
        console.log(r.data.hits[0].largeImageURL)
    })

    // res.send({longitude: data[0], latitude: data[1], country: data[2]})
    // const {lng, lat, countryName} = data.data.geonames[0]
    // res.send({longitude: lng, latitude: lat, country: countryName})
    // return res.send({longitude: lng, latitude: lat, country: countryName})
        
})


app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`)
})