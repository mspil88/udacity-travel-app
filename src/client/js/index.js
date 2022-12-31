const addTrip = document.querySelector(".add-tripBtn")
const location = document.querySelector(".add-location")
const startDate = document.querySelector(".start-dt")
const endDate = document.querySelector(".end-dt")


//temporary variables to test rendering logic
const locationDurationDays = document.querySelector(".location-duration-days");
const destinationInfo = document.querySelector(".destination-info");
const startInfo = document.querySelector(".start-info");
const endInfo = document.querySelector(".end-info");
const locationPlaceholder = document.querySelector(".img-placeholder");
const maxTempElem = document.querySelector(".max-temp");
const minTempElem = document.querySelector(".min-temp");
const modeWeatherElem = document.querySelector(".mode-weather");
const countRainElem = document.querySelector(".count-rain");


const postData =  async (url = '', data = {}) => {
    //helper function to post data back, inspired by the fetch API documentation
    try {
      const response = await fetch(url, {
        method: 'POST', 
        mode: 'cors', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
      });
      return response.json(); 
    } catch(error) {
      console.log(error)
    }
  }

const getData = async(url = '') => {
    try {
      const response = await fetch(url, {
          method: "GET",
          mode: "cors"
      });
      return response.json();
    } catch(error) {
      console.log(error);
    }
}

const reverseDate = (date) => {
    const split = date.split("/")
    return `${split[2]}/${split[1]}/${split[0]}`
}

const dayDifference = (startDate, endDate) => {
  const MSECS_PER_DAY = 1000 * 60 * 60 * 24;

  const startUTC = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endUTC = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  return Math.floor((endUTC - startUTC) / MSECS_PER_DAY);
}


const calculateDuration = (endDate) => {
    let today = new Date(Date.now()).toLocaleDateString().split(",")[0]
    today = reverseDate(today)
    console.log("TODAY")
    console.log(today); 
    endDate = reverseDate(endDate)
    
    return dayDifference(new Date(today), new Date(endDate));
}

const getMaxTemperature = (weatherData) => {
    let maxTemp = - 1000;

    for(let i of weatherData.weather) {
        if(i.app_max_temp > maxTemp) {
            maxTemp = i.app_max_temp
        } else {
            continue
        }
      }
    return maxTemp;
    
}

const getMinTemperature = (weatherData) => {
  let minTemp = 1000;

  for(let i of weatherData.weather) {
      if(i.app_min_temp < minTemp) {
          minTemp = i.app_min_temp
      } else {
          continue
      }
    }
  return minTemp;
}

const aggregateWeather = (weatherData) => {
  let weather = {}

  for(let i of weatherData.weather) {
      if(i.weather.description in weather) {
          weather[i.weather.description] ++
      } else {
          weather[i.weather.description] = 1
      }
  }

  return weather

}

const countRainyDays = (weatherData) => {
    let rainyDays = 0

    for(let i of weatherData.weather) {
        if(i.weather.description.includes("rain")) {
          rainyDays ++;
        }
    }

    return rainyDays

}

const groupByMax = (weatherData) => {
  const aggregatedWeather = aggregateWeather(weatherData)
  console.log(aggregatedWeather)
  const maxValue = Math.max(...Object.values(aggregatedWeather))
  console.log(maxValue)

  return Object.keys(aggregatedWeather).filter(key => aggregatedWeather[key] == maxValue)
}



const handleEvent = () => {
    addTrip.addEventListener("click", async()=> {
        const myLocation = location.value;
        const myStartDate = startDate.value;
        const myEndDate = endDate.value;
        const data = await postData("http://localhost:8081/userData", {location: myLocation, start: myStartDate, end: myEndDate})
        const dayDiff = calculateDuration(myStartDate)
        locationDurationDays.textContent = `Your trip is in ${dayDiff} days`
        const returnData = await getData("http://localhost:8081/retrieveData");
        const [geoNamesData, weatherData, pixbayData] = returnData;
        const weatherObj = {maxTemperature: getMaxTemperature(weatherData),
                            minTemperature: getMinTemperature(weatherData),
                            modalWeather: groupByMax(weatherData),
                            rainyDays: countRainyDays(weatherData)
                            } 
        
        renderTripInfo(myLocation, myStartDate, myEndDate, geoNamesData, weatherObj, pixbayData);
        console.log(getMaxTemperature(weatherData))
        console.log(getMinTemperature(weatherData))
        console.log(groupByMax(weatherData))
        console.log(countRainyDays(weatherData));
    })
}

//temporary functions to test rendering

const processMyLocation = (location) => {
    const lowerCased = location.toLowerCase();
    return lowerCased[0].toUpperCase()+lowerCased.slice(1, lowerCased.length);
} 

const renderTripInfo = (location, startDate, endDate, geoNamesData, weatherObj, pixbayData) => {
    const url = pixbayData.url;
    console.log(url)
    destinationInfo.textContent = `Destination: ${processMyLocation(location)}, ${geoNamesData.country}`
    startInfo.textContent = `Start Date: ${startDate}`
    endInfo.textContent = `End Date: ${endDate}`
    console.log(locationPlaceholder)
    locationPlaceholder.src = pixbayData.url;
    maxTempElem.textContent = `Max temperture: ${weatherObj.maxTemperature}`
    minTempElem.textContent = `Min temperature: ${weatherObj.minTemperature}`
    modeWeatherElem.textContent = `Most common forecast: ${weatherObj.modalWeather[0]}`
    countRainElem.textContent = `Days with rain: ${weatherObj.rainyDays}`
}




handleEvent();

export {handleEvent}