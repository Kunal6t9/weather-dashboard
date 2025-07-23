const api_key = "b1ecc3b1cf71071d5fdfa39e706cf8ec";
const unitSymbol = "°C";
const windUnit = "m/s";

// Function to fetch weather by city name
function getweather() {
  const city = document.getElementById("city").value;
  if (city === "") {
    alert("Please enter a city");
    return;
  }
  fetchweather(city);
}

// Function to get current location
function getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchweather_bycoords(lat, lon);
    });
} else {
  alert("Error while Locating");
 }
}
// Fetch weather by city
function fetchweather(city) {
  document.getElementById("loading").style.display = "block";

  const current_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;
  const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`;

  fetch(current_url)
    .then(response => {
      if (!response.ok) throw new Error("City not found!");
      return response.json();
    })
    .then(data => currentweather(data))
    .catch(error => {
      document.getElementById("current-weather").innerHTML = `<p style="color:red;"> ${error.message}</p>`;
      document.getElementById("forecastcontainer").innerHTML = "";
    })
    .finally(() => {
      document.getElementById("loading").style.display = "none";
    });

  fetch(forecast_url)
    .then(response => {
      if (!response.ok) throw new Error("Forecast unavailable");
      return response.json();
    })
    .then(data => forecast_days(data))
    .catch(error => {
      console.error("Fail to fetch forecast: " + error.message);
    });
}

// Fetch weather by coordinates
function fetchweather_bycoords(lat, lon) {
  document.getElementById("loading").style.display = "block";

  const current_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
  const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;

  fetch(current_url)
    .then(response => response.json())
    .then(data => currentweather(data))
    .catch(error => {
      document.getElementById("current-weather").innerHTML = `<p style="color:red;">Failed to fetch Location</p>`;
    })
    .finally(() => {
      document.getElementById("loading").style.display = "none";
    });

  fetch(forecast_url)
    .then(response => response.json())
    .then(data => forecast_days(data))
    .catch(error => console.error('Forecast fetch error.'));
}

// Show current weather
function currentweather(data) {
  const con = document.getElementById("current-weather");
  const weather = data.weather[0].main.toLowerCase();

  con.innerHTML = `
    <h3>${data.name} (${new Date().toISOString().split("T")[0]})</h3>
    <p>Temperature: ${data.main.temp}${unitSymbol}</p>
    <p>Weather: ${data.weather[0].main}</p>
    <p>Wind: ${data.wind.speed} ${windUnit}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
  `;

  document.getElementById("city").value = data.name;
}

// Show 5-day forecast
function forecast_days(data) {
  const con = document.getElementById("forecastcontainer");
  con.innerHTML = "";

  const forecastlist = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  forecastlist.slice(0, 5).forEach(day => {
    const date = day.dt_txt.split(" ")[0];
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <h4>${date}</h4>
      <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
      <p>Temp: ${day.main.temp}${unitSymbol}</p>
      <p>Wind: ${day.wind.speed} ${windUnit}</p>
      <p>Humidity: ${day.main.humidity}%</p>
    `;

    con.appendChild(card);
  });
}
