const addTrip = document.querySelector(".add-tripBtn")
const location = document.querySelector(".add-location")


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

const handleEvent = () => {
    addTrip.addEventListener("click", async()=> {
        console.log(location.value)
        const data = await postData("http://localhost:8081/userData", {location: location.value})
        console.log(data);
    })
}
console.log("stuff")

handleEvent();

export {handleEvent}