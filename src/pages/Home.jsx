import { useState } from "react";

const apiKey = "99a155366a5f13462934cb1f9df40af3";

const WindDirections = [
  { min: 349, max: 11, direction: "North" },
  { min: 12, max: 33, direction: "North-Northeast" },
  { min: 34, max: 56, direction: "Northeast" },
  { min: 57, max: 78, direction: "East-Northeast" },
  { min: 79, max: 101, direction: "East" },
  { min: 102, max: 123, direction: "East-Southeast" },
  { min: 124, max: 146, direction: "Southeast" },
  { min: 147, max: 168, direction: "South-Southeast" },
  { min: 169, max: 191, direction: "South" },
  { min: 192, max: 213, direction: "South-Southwest" },
  { min: 214, max: 236, direction: "Southwest" },
  { min: 237, max: 258, direction: "West-Southwest" },
  { min: 259, max: 281, direction: "West" },
  { min: 282, max: 303, direction: "West-Northwest" },
  { min: 304, max: 326, direction: "Northwest" },
  { min: 327, max: 348, direction: "North-Northwest" },
];

const getWindDirection = (degrees) => {
  const direction = WindDirections.find((item) => {
    return degrees >= item.min && degrees <= item.max;
  });

  return direction ? direction.direction : "";
};

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const showWeather = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=de&appid=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "404") {
          setCity("");
          alert("Stadt nicht gefunden.");
          return;
        }

        if (!city) {
            return <p>Loading...</p>;
        }

        const i = data.wind.deg;
        const windDirection = getWindDirection(i);

        const shiftInSeconds = data.timezone;
        const berlinTime = new Date();
        const berlinOffset = berlinTime.getTimezoneOffset() * 60;
        const utcTime = new Date();
        utcTime.setSeconds(utcTime.getSeconds() + shiftInSeconds + berlinOffset);

        setWeatherData({
          city: city.charAt(0).toUpperCase() + city.slice(1),
          iconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          temperature: (data.main.temp - 274.15).toFixed(2) + "°C",
          wind: data.wind.speed + " m/s " + windDirection,
          cloudiness: data.weather[0].description,
          pressure: data.main.pressure + " hPa",
          humidity: data.main.humidity + "%",
          geoCoordinates: `[${data.coord.lat}, ${data.coord.lon}]`,
          sunrise: (new Date(data.sys.sunrise * 1000 + data.timezone * 1000 - 3600 * 1000)).toLocaleTimeString(data.sys.country),
          sunset: (new Date(data.sys.sunset * 1000 + data.timezone * 1000 - 3600 * 1000)).toLocaleTimeString(data.sys.country),
          localTime: utcTime.toLocaleTimeString('en-US', { hour12: false }),
        });
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      showWeather();
    }
  };

  return (
    <section>
      <input type="text" id="cityInput" value={city} onChange={(e) => setCity(e.target.value)} onKeyPress={handleKeyPress} />
      <button onClick={showWeather}>Get Weather</button>

      {weatherData && (
        <>
        <article>
            <h1 id="city">{weatherData.city}</h1>
            <h2>{weatherData.temperature}</h2>
            <img id="imgOut" src={weatherData.iconUrl} alt="Weather Icon" />
        </article>
        <table>
            <tbody>
                <tr id="temperatur">
                    <th>Temperatur:</th>
                    <td>{weatherData.temperature}</td>
                </tr>
                <tr id="wind">
                    <th>Wind:</th>
                    <td>{weatherData.wind}</td>
                </tr>
                <tr id="cloudsOut">
                    <th>Wolken :</th>
                    <td>{weatherData.cloudiness}</td>
                </tr>
                <tr id="pressure">
                    <th>Druck: </th>
                    <td>{weatherData.pressure}</td>
                </tr>
                <tr id="humidity">
                    <th>Luftfeuchtigkeit: </th>
                    <td>{weatherData.humidity}</td>
                </tr>
                <tr id="geocords">
                    <th>GeoKoordinanten: </th>
                    <td>{weatherData.geoCoordinates}</td>
                </tr>
                <tr id="sunrise">
                    <th>Sonnenaufgang: </th>
                    <td>{weatherData.sunrise}</td>
                </tr>
                <tr id="sunset">
                    <th>Sonnenuntergang: </th>
                    <td>{weatherData.sunset}</td>
                </tr>
                <tr id="localeTime">
                    <th>Local Time: </th>
                    <td>{weatherData.localTime}</td>
                </tr>
            </tbody>
        </table>
        </>

      )}
    </section>
  );
};

export default WeatherApp;
