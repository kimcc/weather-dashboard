const weatherForm = document.querySelector('#weatherForm');
const weatherInput = document.querySelector('#weatherInput');
const currentWeather = document.querySelector('#currentWeather');
const searchList = document.querySelector('#searchList');
const forecastWeather = document.querySelector('#forecastWeather');
let searchArray;
//let location = "";

// Create the recent search items
const createRecentSearches = function() {
    if (JSON.parse(localStorage.getItem('searchItem'))) {
        const searchData = JSON.parse(localStorage.getItem('searchItem'));

        searchList.onclick = recentSearchHandler;

        // Reverse array to show most recent first
        searchData.reverse();
        searchList.innerHTML = '';
    
        searchData.forEach(function(item, index) {
            // Show only 5 most recent
            if (index < 5) {
                const searchText = document.createElement('li');
                searchText.textContent = item;
                searchText.classList.add("capitalize");
                searchList.appendChild(searchText);
            }
        });
    }
}

// Put recent search text into the input
const recentSearchHandler = function(event) {
    weatherInput.value = event.target.textContent;

    searchList.classList.toggle("show");

    const location = weatherInput.value.trim();
    if (location) {
        getWeather(location);
    }

    saveSearch(location);
}

const formSubmitHandler = function(event) {
    // Prevent page refresh
    event.preventDefault();

    const location = weatherInput.value.trim();
    if (location) {
        getWeather(location);
    }

    saveSearch(location);
    searchList.classList.remove("show");
}

// Update array by starting from localstorage or create empty one if it doesn't exist
const saveSearch = function(searchTerm) {
    // if (localStorage.getItem('searchItem')) {
    //     searchArray = JSON.parse(localStorage.getItem('searchItem'));
    // } else {
    //     searchArray = [];
    // }

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

    const temp = document.createElement("h1");
    temp.textContent = `${Math.round(data.current.temp)}°F`;

    const locationText = document.createElement("h3");
    locationText.textContent = location;
    locationText.classList.add("card-text");
    locationText.classList.add("capitalize");

    const today = document.createElement("h3");
    today.textContent = "Today";
    today.classList.add("card-text", "-mb-2");

    const windSpeed = document.createElement("p");
    windSpeed.textContent = `Wind: ${Math.round(data.current.wind_speed)} MPH`;
    windSpeed.classList.add("card-text");
    
    const humidity = document.createElement("p");
    humidity.textContent = `Humidity: ${data.current.humidity}%`;
    humidity.classList.add("card-text");

    const uvIndexContainer = document.createElement("div");
    const uvIndex = document.createElement("p");
    const uvRating = document.createElement("span");
    uvIndex.textContent = data.current.uvi;
    uvIndex.classList.add("card-text");
    uvRating.classList.add("card-text");

    uvIndexContainer.appendChild(uvIndex);
    uvIndex.appendChild(uvRating);

    const icon = document.createElement("img");
    const iconId = data.current.weather[0].icon;
    icon.setAttribute('src', `http://openweathermap.org/img/wn/${iconId}@4x.png`);
    icon.setAttribute('alt', 'Weather icon');

    //currentWeather.appendChild(date);
    currentWeather.appendChild(icon);
    currentWeather.appendChild(temp);
    currentWeather.appendChild(today);
    currentWeather.appendChild(locationText);
    currentWeather.appendChild(uvIndexContainer);

    currentWeather.appendChild(humidity);
    currentWeather.appendChild(windSpeed);

    if (data.current.uvi < 3) {
        uvIndex.classList.add('uv-low');
        uvRating.textContent = " Good"
    } else if (data.current.uvi >= 3 && data.current.uvi < 8) {
        uvIndex.classList.add('uv-medium');
        uvRating.textContent = " Medium"
    } else {
        uvIndex.classList.add('uv-high');
        uvRating.textContent = " High"
    }
    
    getForecast(data);
}

// Get the 5 day forecast
const getForecast = function(data) {

    forecastWeather.innerHTML = '';

    data.daily.forEach(function(value, index) {
        if (index > 0 &&  index < 6) {
            const forecastContainer = document.createElement("div");
            forecastContainer.classList.add("text-center");

            const forecastDate = document.createElement("p");
            const unixDate = value.dt;
            forecastDate.textContent = new Date(unixDate*1000).toLocaleString('en-US', {weekday: 'long'});
            forecastDate.classList.add('pb-14');

            const forecastTemp = document.createElement("h2");
            forecastTemp.textContent = `${Math.round(value.temp.day)}°F`;
            forecastTemp.classList.add('pb-14');

            const forecastWindSpeed = document.createElement("p");
            forecastWindSpeed.textContent = `${Math.round(value.wind_speed)} MPH`;

            const forecastHumidity = document.createElement("p");
            forecastHumidity.textContent = `${value.humidity}%`;

            const forecastIcon = document.createElement("img");
            const forecastIconId = value.weather[0].icon;
            forecastIcon.setAttribute('src', `http://openweathermap.org/img/wn/${forecastIconId}@2x.png`);
            forecastIcon.setAttribute('alt', 'Weather icon');
            forecastIcon.classList.add('pb-20');

            forecastContainer.appendChild(forecastDate);
            forecastContainer.appendChild(forecastIcon);
            forecastContainer.appendChild(forecastTemp);
            forecastContainer.appendChild(forecastWindSpeed);
            forecastContainer.appendChild(forecastHumidity);

            forecastWeather.appendChild(forecastContainer);
        }
    });
}

weatherForm.addEventListener('submit', formSubmitHandler);
createRecentSearches();
weatherInput.addEventListener('click', function(e){
    searchList.classList.toggle("show");
});

window.onclick = function(event) {
    if (!event.target.matches('#weatherInput') && !event.target.matches('#searchList')) {
        searchList.classList.remove("show");
    }
}

window.onload = function() {
    createRecentSearches();

    // Get the most recent location from localstorage, otherwise set the first location to New York
    if (localStorage.getItem('searchItem')) {
        searchArray = JSON.parse(localStorage.getItem('searchItem'));
        searchArray.reverse();
    } else {
        searchArray = ["New York"];
    }

    getWeather(searchArray[0]);

    weatherInput.value = searchArray[0];
}