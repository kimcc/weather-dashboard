import { useLoaderData } from "@remix-run/react";

// The loader function is defined by the route and will be called on the server before rendering to provide data to the route
// The loader takes in a request object that has info about the request
export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const search = new URLSearchParams(url.search);
    let location = search.get("location");

    // Search for New York if it's empty
    if (!search.get("location")) {
      location = "New York";
    }

    // Get latitude and longitude
    const latLongResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}`
    );
    const latLongData = await latLongResponse.json();
    const lat = latLongData.coord.lat;
    const lon = latLongData.coord.lon;

    // Get the location's weather
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.WEATHER_API_KEY}`
    )
    const data = await response.json();

    const iconId = data.current.weather[0].icon;
    const dailyForecast = data.daily;

    // Return the info we want shown on the page
    return {
      location,
      temp: `${Math.round(data.current.temp)}°F`,
      wind: `${Math.round(data.current.wind_speed)} MPH`,
      humidity: `${data.current.humidity}%`,
      uvi: `${data.current.uvi}`,
      iconId,
      iconSrc: `http://openweathermap.org/img/wn/${iconId}@4x.png`,
      dailyForecast
    };
  } catch (err) {
    console.error(err);
    return {};
  }
}

export default function Index() {
  const data = useLoaderData();
  // Get forecast for next 5 days, not including today
  const forecastDays = data.dailyForecast.slice(1, 6);

  const daily = forecastDays.map((forecastDay, key) => {
    return (
      <div key={key}>
        <p>{new Date(forecastDay.dt * 1000).toLocaleString("en-US", { weekday: "long" })}</p>
        <img src={`http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png`} alt={forecastDay.weather[0].description}></img>
        <h2>{Math.round(forecastDay.temp.day)}°F</h2>
        <p>{Math.round(forecastDay.wind_speed)} MPH</p>
        <p>{forecastDay.humidity} %</p>
      </div>
    )
  });

  return (
    <>
      <form action="/weather" method="get">
        <span className="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input type="text" name="location" defaultValue={data.location} />
      </form>
      <div>
        {/* Today's weather */}
        <img src={data.iconSrc} alt={data.iconId}></img>
        <h1>{data.temp}</h1>
        <h3>Today</h3>
        <h3>{data.location}</h3>
        <p>{data.uvi}</p>
        <p>{data.humidity}</p>
        <p>{data.wind}</p>
        {/* Forecast weather */}
        <div>
          {daily}
        </div>
      </div>
    </>
  )
}