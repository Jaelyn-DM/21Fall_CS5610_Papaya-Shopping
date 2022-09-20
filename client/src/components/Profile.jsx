import React, { useState } from "react";
import Navbar from "./Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/Profile.css";

export default function Profile() {
  const { logout, user, isLoading } = useAuth0();
  const [weatherVancouver, setWeatherVancouver] = useState();
  const location = ["49.2729", "-123.120738"];

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  function userLogout() {
    logout({ returnTo: window.location.origin });
  }

  async function getWeather() {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely&units=metric&appid=7273d369c1f620a53040d4dcb4acdf44&lat=${location[0]}&lon=${location[1]}`,
      {
        method: "GET",
      }
    );
    const weatherFetched = await res.json();
    if (weatherFetched) {
      setWeatherVancouver(weatherFetched);
    }
  }

  return (
    <div className="App">
      <title>profile page</title>
      <Navbar />
      <div className="profile">
        <div>
          <p>Name: {user.nickname}</p>
        </div>
        <div>
          <p>Email: {user.email}</p>
        </div>
        <div>
          <img src={user.picture} alt="user image"></img>
        </div>
        <button className="exit-button" onClick={() => userLogout()}>
          LogOut
        </button>
        <div className="weather">
          <button onClick={() => getWeather()}>Get Weather</button>
          {weatherVancouver ? (
            <div>
              <p>Weather: {weatherVancouver.current.weather[0].main}</p>
              <p>Temp: {weatherVancouver.current.temp}</p>
              <p>Feels Like: {weatherVancouver.current.feels_like}</p>
              <p>Pressure: {weatherVancouver.current.pressure}</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
