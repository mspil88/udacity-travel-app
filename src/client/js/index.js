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

const handleEvent = () => {
    addTrip.addEventListener("click", async()=> {
        const myLocation = location.value;
        const myStartDate = startDate.value;
        const myEndDate = endDate.value;
        const data = await postData("http://localhost:8081/userData", {location: myLocation, start: myStartDate, end: myEndDate})
        const dayDiff = calculateDuration(myEndDate)
        locationDurationDays.textContent = `Trip in ${dayDiff} days`
        const returnData = await getData("http://localhost:8081/retrieveData");
        const [geoNamesData, weatherData, pixbayData] = returnData; 
        console.log(weatherData);
        renderTripInfo(myLocation, myStartDate, myEndDate, geoNamesData, weatherData, pixbayData);

    })
}

//temporary functions to test rendering

const processMyLocation = (location) => {
    const lowerCased = location.toLowerCase();
    return lowerCased[0].toUpperCase()+lowerCased.slice(1, lowerCased.length);
} 

const renderTripInfo = (location, startDate, endDate, geoNamesData, weatherData, pixbayData) => {
    const url = pixbayData.url;
    console.log(url)
    destinationInfo.textContent = `Destination: ${processMyLocation(location)}, ${geoNamesData.country}`
    startInfo.textContent = `Start Date: ${startDate}`
    endInfo.textContent = `End Date: ${endDate}`
    console.log(locationPlaceholder)
    locationPlaceholder.src = pixbayData.url;
}




handleEvent();

export {handleEvent}