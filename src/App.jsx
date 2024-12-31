import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [selectedCities, setSelectedCities] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const cities = ['New York', 'London', 'Tokyo', 'Mumbai', 'Paris']
  const apiKey = "947bc417f271f0316bb355197724017e";

  useEffect(() => {
    const selectedCitiesWeather = async () => {
      const dataPromises = cities.map(city =>
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      );
      const results = await Promise.all(dataPromises);
      const formattedData = results.map(res => ({
        city: res.data.name,
        country: res.data.sys.country,
        temp: res.data.main.temp,
        description: res.data.weather[0].description,
        icon: res.data.weather[0].icon,
        wind: res.data.wind.speed,
        humidity: res.data.main.humidity,
        feels: res.data.main.feels_like,
      }));
      setSelectedCities(formattedData);
    };

    selectedCitiesWeather();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % selectedCities.length);
    }, 10000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [selectedCities]);


  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setError("");
    } catch (err) {
      setError("City not found. Please try again!");
      setWeather(null);
    }
  };
  return (
    <div className="flex md:flex-row flex-col">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      <div className="text-center flex flex-col h-screen md:w-[70vw] w-full text-white">
        <div className="h-[30vh] flex flex-col justify-center items-center md:gap-4 gap-2">
          <h1 className="text-xl font-bold flex justify-center gap-2">SkyCast - Weather App<lord-icon
            src="https://cdn.lordicon.com/kikjlzqr.json"
            trigger="loop"
            state="loop-cycle"
            colors="primary:#ffffff">
          </lord-icon></h1>
          <div className="flex md:flex-row flex-col gap-2 mmd:gap-5">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-4 rounded-3xl text-base text-gray-700"
            />
            <button onClick={fetchWeather} className="p-4 bg-sky-400 font-semibold rounded-3xl">
              Get Weather
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-lg">{error}</p>}

        {weather && (
          <div className="flex flex-col justify-center items-center">
            <h2 className="font-bold text-xl">
              {weather.name}, {weather.sys.country}
            </h2>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
            <p className="font-semibold text-lg">{weather.weather[0].description.toUpperCase()}</p>
            <p className="font-semibold text-lg">Temperature : {weather.main.temp}°C</p>
            <p className="font-semibold text-lg">Feels like : {weather.main.feels_like}°C</p>
            <p className="font-semibold text-lg">Humidity : {weather.main.humidity}%</p>
            <p className="font-semibold text-lg">Wind : {weather.wind.speed} km/h</p>
          </div>
        )}
      </div>
      <div className="text-white hidden md:flex flex-col justify-center items-center md:w-[30vw] w-full">
        <h2 className="text-xl font-bold mb-4">Famous Cities</h2>
        {selectedCities.length > 0 ? (
          <div className="flex flex-col justify-center items-center bg-gray-800 py-6 rounded-xl mb-4 px-10">
            <h3 className="font-bold text-lg">
              {selectedCities[currentIndex].city}, {selectedCities[currentIndex].country}
            </h3>
            <img
              src={`http://openweathermap.org/img/wn/${selectedCities[currentIndex].icon}@2x.png`}
              alt="weather icon"
            />
            <p className="font-semibold">{selectedCities[currentIndex].description.toUpperCase()}</p>
            <p>Temperature:{selectedCities[currentIndex].temp}°C</p>
            <p>Feels like: {selectedCities[currentIndex].feels}°C</p>
            <p>Humidity: {selectedCities[currentIndex].humidity}%</p>
            <p>Wind: {selectedCities[currentIndex].wind} km/h</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>

    </div>
  );
};

export default App;
