const addTrip = document.querySelector(".add-tripBtn")
const location = document.querySelector(".add-location")
const startDate = document.querySelector(".start-dt")
const endDate = document.querySelector(".end-dt")
const mainSection = document.querySelector(".main")


//temporary variables to test rendering logic
// const locationDurationDays = document.querySelector(".location-duration-days");
// const destinationInfo = document.querySelector(".destination-info");
// const startInfo = document.querySelector(".start-info");
// const endInfo = document.querySelector(".end-info");
// const locationPlaceholder = document.querySelector(".img-placeholder");
// const maxTempElem = document.querySelector(".max-temp");
// const minTempElem = document.querySelector(".min-temp");
// const modeWeatherElem = document.querySelector(".mode-weather");
// const countRainElem = document.querySelector(".count-rain");
const createTripElem = (tripId, destination, startDate, endDate, image, maxTemp, minTemp, modeForecast, rainyDays, country) => {
  const tripContainer = document.createElement("div")
  const navContainer = document.createElement("div")
  const trashBtn = document.createElement("i")
  const tripInfo = document.createElement("div")
  const imgContainer = document.createElement("div")
  const img = document.createElement("img")
  const todoContainer = document.createElement("div")
  const todoBtn = document.createElement("btn")
  const tripInfoContainer = document.createElement("div")
  const destinationInfo = document.createElement("h1")
  const startInfo = document.createElement("p")
  const endInfo = document.createElement("p")
  const locationDurationDays = document.createElement("p")
  const forecast = document.createElement("h1")
  const maximumTemp = document.createElement("p")
  const minimumTemp = document.createElement("p")
  const modeWeather = document.createElement("p")
  const countRain = document.createElement("p")

  tripContainer.setAttribute("class", `trip-container trip-${tripId}`)
  navContainer.setAttribute("class", `nav-container nav-${tripId}`)
  tripInfo.setAttribute("class", `trip-info trip-info-${tripId}`)
  trashBtn.setAttribute("class", `fa-sharp fa-solid fa-trash trash-${tripId}`)
  imgContainer.setAttribute("class", `image-container img-container-${tripId}`)
  img.setAttribute("class", `img-placeholder img-placeholder-${tripId}`)
  todoContainer.setAttribute("class", `todo-container todo-container-${tripId}`)
  todoBtn.setAttribute("class", `todo-btn todo-btn-${tripId}`)
  tripInfoContainer.setAttribute("class", `trip-info-container trip-info-container-${tripId}`)
  destinationInfo.setAttribute("class", `destination-info destination-info-${tripId}`)
  startInfo.setAttribute("class", `start-info start-info-${tripId}`)
  endInfo.setAttribute("class", `end-info end-info-${tripId}`)
  locationDurationDays.setAttribute("class", `location-duration-days location-duration-days-${tripId}`)
  forecast.setAttribute("class", `forcast forcast-${tripId}`)
  maximumTemp.setAttribute("class", `max-temp max-temp-${tripId}`)
  minimumTemp.setAttribute("class", `minTemp minTemp-${tripId}`)
  modeWeather.setAttribute("class", `mode-weather mode-weather-${tripId}`)
  countRain.setAttribute("class", `count-rain count-rain-${tripId}`)

  img.setAttribute("src", image)
  console.log("CREATING ELEM")
  console.log(destination)
  destinationInfo.textContent = `Destination: ${destination}`
  startInfo.textContent = `Start date: ${startDate}`
  endInfo.textContent = `End date: ${endDate}`
  locationDurationDays.textContent = `I am going to ${destination} for ${calculateDuration(startDate, endDate)} days`

  forecast.textContent = "Forecast"
  maximumTemp.textContent = `Max temperature: ${maxTemp}`
  minimumTemp.textContent = `Min temperature: ${minTemp}`
  modeWeather.textContent = `Most common forecast: ${modeForecast}`
  countRain.textContent = `Days with rain: ${rainyDays}`



  
  tripContainer.appendChild(navContainer)
  navContainer.appendChild(trashBtn)

  tripContainer.appendChild(tripInfo)
  tripInfo.appendChild(imgContainer)
  imgContainer.appendChild(img)
  imgContainer.appendChild(todoContainer)
  todoContainer.appendChild(todoBtn)

  tripInfo.appendChild(tripInfoContainer)
  tripInfoContainer.appendChild(destinationInfo)
  tripInfoContainer.appendChild(startInfo)
  tripInfoContainer.appendChild(endInfo)
  tripInfoContainer.appendChild(locationDurationDays)
  tripInfoContainer.appendChild(forecast)
  tripInfoContainer.appendChild(maximumTemp)
  tripInfoContainer.appendChild(minimumTemp)
  tripInfoContainer.appendChild(modeWeather)
  tripInfoContainer.appendChild(countRain)

  return tripContainer
}


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

//code for the trip items

function* generateID(index=0) {
    let idx = index
    while(true) {
        yield idx++;
    }

}

const getMaxID = (trips) => {
    let _max = 0
    for(let trip of trips) {
        if(trip["id"] > _max) {
            _max = trip["id"]
        }
    }

    return _max;
}

const setLocalStorage = (trips) => {
    localStorage.setItem("trips", JSON.stringify(trips))
}

const getLocalStorage = () => {
    return JSON.parse(localStorage.getItem("trips"))
}

class Trip {
    constructor(id, destination, startDate, endDate, image, maxTemp, minTemp, modeForecast, rainyDays, country) {
        this.id = id
        this.destination = country !== undefined ? `${destination}, ${country}` : destination
        this.startDate = startDate
        this.endDate = endDate
        this.image = image
        this.maxTemp = maxTemp
        this.minTemp = minTemp
        this.modeForecast = modeForecast
        this.rainyDays = rainyDays
        this.country = country
    }

    getTrip() {
        return {destination: `${this.destination}`,
                startDate: this.startDate,
                endDate: this.endDate,
                image: this.image,
                maxTemp: this.maxTemp,
                minTemp: this.minTemp,
                modeForecast: this.modeForecast,
                rainyDays: this.rainyDays,
                }
        }
    
    getTripId() {
        return this.id;
    }

    createTrip() {
        const elem = createTripElem(this.getTripId(), `${this.destination}`, this.startDate, this.endDate, this.image, this.maxTemp, this.minTemp,
                                    this.modeForecast, this.rainyDays)
        return elem
                                  
    }

}



const appendToMain = (main, tripContainer) => {
    main.append(tripContainer)
} 

class TripList {
    constructor(listElement) {
        this.tripMap = new Map()
        this.listElement = listElement
        this.tripElements = []
        this.addTripBtn = document.querySelector(".add-tripBtn")
        this.id = generateID()
        this.addTripsFromLocal()
        this.mostRecentTrip = updateMostRecentTrip()

        this.addTripBtn.addEventListener("click", async ()=> {
            const myLocation = document.querySelector(".add-location").value;
            const myStartDate = document.querySelector(".start-dt").value;
            const myEndDate = document.querySelector(".end-dt").value;

            const data = await postData("http://localhost:8081/userData", {location: myLocation, start: myStartDate, end: myEndDate})
           
            const returnData = await getData("http://localhost:8081/retrieveData");
            const [geoNamesData, weatherData, pixbayData] = returnData;
            const weatherObj = {maxTemperature: getMaxTemperature(weatherData),
                                minTemperature: getMinTemperature(weatherData),
                                modalWeather: groupByMax(weatherData),
                                rainyDays: countRainyDays(weatherData)
                                } 
            
            // renderTripInfo(myLocation, myStartDate, myEndDate, geoNamesData, weatherObj, pixbayData);
            const id = this.addTrip(myLocation, myStartDate, myEndDate, pixbayData.url, weatherObj.maxTemperature, weatherObj.minTemperature,
                                    weatherObj.modalWeather, weatherObj.rainyDays, geoNamesData.country)
            this.createTripElement(id)
            this.addEventListenersToElem(this.tripElements[this.tripElements.length-1].getAttribute("class").split("-")[2])
            console.log(this.TripMap)
            this.setTripsInLocalStorage();
            updateMostRecentTrip();
        })


    }
    setTripsInLocalStorage() {
        setLocalStorage([...this.tripMap.values()])
    }

    addTrip(location, startDate, endDate, image, maxTemp, minTemp, modeForecast, rainyDays, country) {
        const tripId = this.id.next().value;
        let trip = new Trip(tripId, location, startDate, endDate, image, maxTemp, minTemp, modeForecast, rainyDays, country)
        this.tripMap.set(tripId, trip)
        return tripId
    }

    addTripsFromLocal() {
        let trips = tripsFromLocalStorage();
        console.log(trips)
        if(trips === null) {
            return;
        } else {        
          this.id = trips !== null ? generateID(getMaxID(trips) + 1): generateID();

          trips.forEach(trip => {
              const tripId = trip["id"]
              this.tripMap.set(tripId, trip)
          })
          this.createTripElements();
          this.addEventListenersToAllElems();
          return;
      }
    }

    getList() {
        return [...this.tripMap.values()]
    }

    getTripById(id) {
        return this.taskMap.get(id)
    }

    createTripElements() {
        
      [...this.tripMap.values()].forEach(itm => {
          const elem = itm.createTrip();
          appendToMain(this.listElement, elem);          
          this.tripElements.push(elem)
      })
      return;
    }

    createTripElement(id) {
        const elem = this.tripMap.get(id).createTrip();
        appendToMain(this.listElement, elem);
        
      
        this.tripElements.push(elem)
        return;
   }

   addEventListenersToAllElems() {

    this.tripElements.forEach(itm => {
        const elemId = itm.getAttribute("class").split("-")[2];
        
        this.addEventListenersToElem(elemId);    
    })
  }

   addEventListenersToElem(elemId) {
        
      const deleteElem = document.querySelector(`.trash-${elemId}`);
      
      deleteElem.addEventListener("click", ()=> {
          const elem = document.querySelector(`.trip-${elemId}`);
          elem.remove();
          this.tripMap.delete(Number(elemId));
          console.log(this.tripMap);
          this.setTripsInLocalStorage();
      });
  

      return; 
  }
}

const tripsFromLocalStorage = () =>  {
    console.log("LOCAL TRIPS")
    let localTrips = getLocalStorage();

    if (localTrips) {
        let tripArray = [];

        localTrips.forEach(itm => {
            tripArray.push(new Trip(
                                    itm["id"], itm["destination"], itm["startDate"], itm["endDate"],
                                    itm["image"], itm["maxTemp"], itm["minTemp"], itm["modeForecast"], itm["rainyDays"]
                                    ))
        })
        return tripArray;
    }    
    return null;
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

const parseDestinationTimes = (container) => {
  let destinationsToSort = []
  for(let i of container) {
      if((i["startDate"].length === 10) & (i["endDate"].length === 10)) {
          destinationsToSort.push({name: i["destination"], date: new Date(i["startDate"])})
      }
  }

  return destinationsToSort
}

const returnMostRecentInfo = (sortedDestinations) => {
  const mostRecent = sortedDestinations[0]
  const mostRecentDate = convertToYYYMMDD(mostRecent.date)
  return [mostRecent.name, mostRecentDate, calculateDurationToNow(mostRecentDate) ]
}

const getMostRecentTrip = () => {
  
  const storedTrips = getLocalStorage()
  console.log("storedTRIPS")
  console.log(storedTrips)
  console.log(storedTrips.length === 0)

  if(!((storedTrips.length === 0) || (storedTrips === null))) {
    const destinationsToSort = parseDestinationTimes(storedTrips);
    destinationsToSort.sort((a, b) => {
        return ((a.date < b.date) ? -1 : ((a.date == b.date) ? 0 : 1));
    });
    return returnMostRecentInfo(destinationsToSort)  
    }
  return null;

}


const calculateDurationToNow = (dt) => {
  let today = new Date(Date.now()).toLocaleDateString().split(",")[0]
  today = reverseDate(today)
  console.log("TODAY")
  console.log(today); 

  const endDate = reverseDate(dt)
  
  return dayDifference(new Date(today), new Date(dt));
}

const convertToYYYMMDD = (date) => {
  //credit: https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  const dt = Date.parse(date)
  const date_obj = new Date(dt)
  return `${date_obj.getFullYear()}-${date_obj.toLocaleString("default", { month: "2-digit" })}-${date_obj.toLocaleString("default", { day: "2-digit"})}`
}

const updateMostRecentTrip = () => {
    const mostRecentTrip = getMostRecentTrip()
    const nextTripElem = document.querySelector(".my-next-trip")
    mostRecentTrip !== null 
    ? nextTripElem.textContent = `My next trip is to ${mostRecentTrip[0]} in ${mostRecentTrip[2]} days`
    : nextTripElem.textContent = ''

}


const calculateDuration = (startDate, endDate) => {
    // let today = new Date(Date.now()).toLocaleDateString().split(",")[0]
    // today = reverseDate(today)
    // console.log("TODAY")
    // console.log(today); 
    startDate = reverseDate(startDate)
    endDate = reverseDate(endDate)
    
    return dayDifference(new Date(startDate), new Date(endDate));
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
       
        const returnData = await getData("http://localhost:8081/retrieveData");
        const [geoNamesData, weatherData, pixbayData] = returnData;
        const weatherObj = {maxTemperature: getMaxTemperature(weatherData),
                            minTemperature: getMinTemperature(weatherData),
                            modalWeather: groupByMax(weatherData),
                            rainyDays: countRainyDays(weatherData)
                            } 
        
                            let list = new TripList(mainSection)

    })
}

//temporary functions to test rendering

const processMyLocation = (location) => {
    const lowerCased = location.toLowerCase();
    return lowerCased[0].toUpperCase()+lowerCased.slice(1, lowerCased.length);
} 

// const renderTripInfo = (location, startDate, endDate, geoNamesData, weatherObj, pixbayData) => {
//     const url = pixbayData.url;
//     console.log(url)
//     destinationInfo.textContent = `Destination: ${processMyLocation(location)}, ${geoNamesData.country}`
//     startInfo.textContent = `Start Date: ${startDate}`
//     endInfo.textContent = `End Date: ${endDate}`
//     console.log(locationPlaceholder)
//     locationPlaceholder.src = pixbayData.url;
//     maxTempElem.textContent = `Max temperture: ${weatherObj.maxTemperature}`
//     minTempElem.textContent = `Min temperature: ${weatherObj.minTemperature}`
//     modeWeatherElem.textContent = `Most common forecast: ${weatherObj.modalWeather[0]}`
//     countRainElem.textContent = `Days with rain: ${weatherObj.rainyDays}`
// }


// let list = new TripList(mainSection)

const handleEvent2 = () => {
  let list = new TripList(mainSection)
}

// handleEvent();


handleEvent2();

export {handleEvent2}