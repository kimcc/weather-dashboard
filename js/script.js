const weatherForm = document.querySelector('#weatherForm');
const weatherInput = document.querySelector('#weatherInput');
const currentWeather = document.querySelector('#currentWeather');
const searchList = document.querySelector('#searchList');
const forecastWeather = document.querySelector('#forecastWeather');
let searchArray;

// Create the recent search items
const createRecentSearches = function() {
    const searchData = JSON.parse(localStorage.getItem('searchItem'));

    // Reverse array to show most recent first
    searchData.reverse();
    searchList.innerHTML = '';

    searchData.forEach(function(item, index) {
        // Show only 5 most recent
        if (index < 5) {
            const searchText = document.createElement('li');
            searchText.textContent = item;
            searchList.appendChild(searchText);
        }
    });
}

// Put recent search text into the input
const recentSearchHandler = function(event) {
    weatherInput.value = event.target.textContent;
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

// Update array by starting from localstorage or create empty one if it doesn't exist
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

    // Clear out children from current weather
    currentWeather.innerHTML = '';

    // Current weather variables
    const date = document.createElement("p");
    const unixDate = data.current.dt;
    const formatDate = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }
    date.textContent = new Date(unixDate*1000).toLocaleString('en-US', formatDate);

    const temp = document.createElement("p");
    temp.textContent = `${data.current.temp}°F`;

    const windSpeed = document.createElement("p");
    windSpeed.textContent = `${data.current.wind_speed} MPH`;
    
    const humidity = document.createElement("p");
    humidity.textContent = `${data.current.humidity}%`;

    const uvIndex = document.createElement("p");
    uvIndex.textContent = data.current.uvi;

    const icon = document.createElement("img");
    const iconId = data.current.weather[0].icon;
    icon.setAttribute('src', `http://openweathermap.org/img/wn/${iconId}@2x.png`);
    icon.setAttribute('alt', 'Weather icon');

    currentWeather.appendChild(date);
    currentWeather.appendChild(icon);
    currentWeather.appendChild(temp);
    currentWeather.appendChild(humidity);
    currentWeather.appendChild(windSpeed);
    currentWeather.appendChild(uvIndex);

    if (data.current.uvi < 3) {
        uvIndex.classList.add('uv-low');
    } else if (data.current.uvi >= 3 && data.current.uvi < 8) {
        uvIndex.classList.add('uv-medium');
    } else {
        uvIndex.classList.add('uv-high');
    }
    
    getForecast(data);
}

// Get the 5 day forecast
const getForecast = function(data) {

    console.log(data.daily);

    data.daily.forEach(function(value, index) {
        if (index > 0 &&  index < 6) {
            const forecastDate = document.createElement("p");
            const unixDate = value.dt;
            const formatDate = {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            }
            forecastDate.textContent = new Date(unixDate*1000).toLocaleString('en-US', formatDate);

            const forecastTemp = document.createElement("p");
            forecastTemp.textContent = `${value.temp.day}°F`;

            const forecastWindSpeed = document.createElement("p");
            forecastWindSpeed.textContent = `${value.wind_speed} MPH`;

            const forecastHumidity = document.createElement("p");
            forecastHumidity.textContent = `${value.humidity}%`;

            const forecastIcon = document.createElement("img");
            const forecastIconId = value.weather[0].icon;
            forecastIcon.setAttribute('src', `http://openweathermap.org/img/wn/${forecastIconId}@2x.png`);
            forecastIcon.setAttribute('alt', 'Weather icon');

            forecastWeather.appendChild(forecastDate);
            forecastWeather.appendChild(forecastIcon);
            forecastWeather.appendChild(forecastTemp);
            forecastWeather.appendChild(forecastWindSpeed);
            forecastWeather.appendChild(forecastHumidity);
        }
    });
}

weatherForm.addEventListener('submit', formSubmitHandler);
searchList.onclick = recentSearchHandler;
createRecentSearches();