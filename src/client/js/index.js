const addTrip = document.querySelector(".add-tripBtn")
const location = document.querySelector(".add-location")
const startDate = document.querySelector(".start-dt")
const endDate = document.querySelector(".end-dt")
const locationDurationDays = document.querySelector(".location-duration-days");

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
        console.log(location.value)
        const data = await postData("http://localhost:8081/userData", {location: location.value})
        const dayDiff = calculateDuration(endDate.value)
        locationDurationDays.textContent = `Trip in ${dayDiff} days`
        const returnData = await getData("http://localhost:8081/retrieveData");
        console.log(returnData);

    })
}
console.log("stuff")

handleEvent();

export {handleEvent}