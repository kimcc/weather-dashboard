const getWeather = async function(){

    // Get the latitude and longitude of a location
    const latLongResponse = await fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=london&appid=2c46a57714cfaf2673339b7b2f255993'
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

getWeather();