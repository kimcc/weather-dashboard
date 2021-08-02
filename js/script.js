const weatherForm = document.querySelector('#weatherForm');
const weatherInput = document.querySelector('#weatherInput');
const searchList = document.querySelector('#searchList');
let searchArray;

const createRecentSearches = function() {
    const searchData = JSON.parse(localStorage.getItem('searchItem'));

    searchData.forEach(function(item) {
        const searchText = document.createElement('li');
        searchText.textContent = item;
        searchList.appendChild(searchText);
    });
}

const formSubmitHandler = function(event) {
    // Prevent page refresh
    event.preventDefault();

    const location = weatherInput.value.trim();
    if (location) {
        getWeather(location);
    }

    saveSearch(location);
    weatherInput.value = '';
}

const saveSearch = function(searchTerm) {
    if (localStorage.getItem('searchItem')) {
        searchArray = JSON.parse(localStorage.getItem('searchItem'))
    } else {
        searchArray = []
    }

    searchArray.push(searchTerm);
    localStorage.setItem('searchItem', JSON.stringify(searchArray));

    createRecentSearches();
}

const getWeather = async function(location){

    // Get the latitude and longitude of a location
    const latLongResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=2c46a57714cfaf2673339b7b2f255993`
    )
    const latLongData = await latLongResponse.json();
    const lat = latLongData.coord.lat;
    const lon = latLongData.coord.lon;

     // Get the location's weather
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=2c46a57714cfaf2673339b7b2f255993`
    )
    const data = await response.json();
    const currentTemp = `${data.current.temp}°F`;

    console.log(currentTemp);
    getForecast(data);
}

// Get the 5 day forecast
const getForecast = function(data) {

    data.daily.forEach(function(value, index) {
        if (index > 0 &&  index < 6) {
            const forecastTemp = `${value.temp.day}°F`;
            console.log(forecastTemp);
        }
    });
}

//getWeather();
weatherForm.addEventListener('submit', formSubmitHandler)