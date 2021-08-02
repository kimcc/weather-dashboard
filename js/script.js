async function getWeather() {
    const response = await fetch(
        'https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&units=imperial&appid=2c46a57714cfaf2673339b7b2f255993'
    )
    const data = await response.json();
    
    const currentTemp = `${data.current.temp}°F`;

    console.log(currentTemp);
    getForecast(data);
}

const getForecast = function(data) {

    data.daily.forEach(function(value, index) {
        if (index > 0 &&  index < 6) {
            const forecastTemp = `${value.temp.day}°F`;
            console.log(forecastTemp);
        }
    });
}

getWeather();