const searchInput = document.getElementById("city-input");
const searchButton = document.getElementById("submit-button");
const apiKey = window.API_KEY;
const URLBase = "https://api.openweathermap.org/data/2.5/";

class CurrentWeatherInterface {
  constructor() {
    this.city = document.querySelector(".current-weather .city");
    this.countryCode = document.querySelector(".current-weather .country-code");
    this.timezone = document.querySelector(".current-weather .timezone");
    this.tempMain = document.querySelector(".current-weather .temp-main");
    this.tempFelt = document.querySelector(".current-weather .temp-felt");
    this.tempDesc = document.querySelector(".current-weather .temp-desc");
    this.pressure = document.querySelector(".current-weather .pressure");
    this.humidity = document.querySelector(".current-weather .humidity");
    this.tempMin = document.querySelector(".current-weather .temp-min");
    this.tempMax = document.querySelector(".current-weather .temp-max");
  }

  update(data) {
    console.log("Updating current weather interface with data");
    this.city.textContent = data.name;
    this.countryCode.textContent = data.sys.country;
    this.timezone.textContent =
      "UTC" + (data.timezone / 3600 >= 0 ? "+" : "") + data.timezone / 3600;
    this.tempMain.textContent = data.main.temp.toFixed(0) + "°C";
    this.tempFelt.textContent =
      "Odczuwalne:" + data.main.feels_like.toFixed(0) + "°C";
    this.tempDesc.textContent = data.weather[0].description;
    this.pressure.textContent = data.main.pressure + " hPa";
    this.humidity.textContent = data.main.humidity + " %";
    this.tempMin.textContent = data.main.temp_min.toFixed(0) + "°C";
    this.tempMax.textContent = data.main.temp_max.toFixed(0) + "°C";
  }
}

class FormattedData {
  constructor() {}
  dateTime;
  tempMain;
  tempFelt;
  tempRange;
  pressure;
  humidity;
  weatherDesc;
}

class ForecastInterface {
  scrollArea;
  constructor() {
    this.scrollArea = document.querySelector(".longterm-weather .scroll-area");
    this.scrollArea.innerHTML = "";
  }

  update(data) {
    console.log("Updating forecast interface with data");
    for (let listItem of data.list) {
      const dataFormatted = new FormattedData();

      const date = new Date(listItem.dt * 1000);
      dataFormatted.dateTime = date.toLocaleString("pl-PL", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      });

      dataFormatted.tempMain = listItem.main.temp.toFixed(0) + "°C";
      dataFormatted.tempFelt =
        "Odczuwalne: " + listItem.main.feels_like.toFixed(0) + "°C";
      dataFormatted.tempRange = `Od ${listItem.main.temp_min.toFixed(
        0,
      )}°C do ${listItem.main.temp_max.toFixed(0)}°C`;
      dataFormatted.pressure = listItem.main.pressure + " hPa";
      dataFormatted.humidity = "wilg." + listItem.main.humidity + " %";
      dataFormatted.weatherDesc = listItem.weather[0].description;
      this.displayData(dataFormatted);
    }
  }

  displayData(dataFormatted) {
    const card = document.createElement("div");
    card.classList.add("weather-card");
    const mainData = document.createElement("div");
    mainData.classList.add("main-data");
    const timeDesc = document.createElement("p");
    timeDesc.classList.add("time-desc");
    timeDesc.textContent = dataFormatted.dateTime;
    const tempMain = document.createElement("p");
    tempMain.classList.add("temp-main");
    tempMain.textContent = dataFormatted.tempMain;
    const tempFelt = document.createElement("p");
    tempFelt.classList.add("temp-felt");
    tempFelt.textContent = dataFormatted.tempFelt;
    const tempRange = document.createElement("p");
    tempRange.classList.add("temp-range");
    tempRange.textContent = dataFormatted.tempRange;
    mainData.appendChild(timeDesc);
    mainData.appendChild(tempMain);
    mainData.appendChild(tempFelt);
    mainData.appendChild(tempRange);
    const extraData = document.createElement("div");
    extraData.classList.add("extra-data");
    const pressure = document.createElement("p");
    pressure.classList.add("pressure");
    pressure.textContent = dataFormatted.pressure;
    const humidity = document.createElement("p");
    humidity.classList.add("humidity");
    humidity.textContent = dataFormatted.humidity;
    const weatherDesc = document.createElement("p");
    weatherDesc.classList.add("weather-desc");
    weatherDesc.textContent = dataFormatted.weatherDesc;
    extraData.appendChild(pressure);
    extraData.appendChild(humidity);
    extraData.appendChild(weatherDesc);
    card.appendChild(mainData);
    card.appendChild(extraData);
    this.scrollArea.appendChild(card);
  }
}

searchButton.addEventListener("click", (e) => {
  const query = searchInput.value;
  console.log("Searching for:", query);
  fetchWeatherData(query);
});

async function fetchWeatherData(cityName) {
  const { lat, lon } = await getCoordinates(cityName);
  console.log("Coordinates:", lat, lon);
  const currentWeatherURL = prepCurrentWeatherURL(lat, lon);
  const currentData = await fetchCurrentWeather(currentWeatherURL);
  console.log("Current Weather Data:", currentData);
  const forecastURL = prepForecastURL(lat, lon);
  const forecastData = await fetchForecast(forecastURL);
  console.log("Forecast Data:", forecastData);
  document.querySelectorAll(".typeCityQuery").forEach((el) => {
    el.style.display = "none";
  });
  document.querySelector(".current-weather").style.visibility = "visible";
  displayCurrentWeather(currentData);
  displayForecast(forecastData);
}

async function getCoordinates(cityName) {
  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},PL&limit=1&appid=${apiKey}`;
  try {
    const response = await fetch(geoURL);
    const data = await response.json();
    if (data.length === 0) {
      throw new Error("City not found");
    }
    const { lat, lon } = data[0];
    console.log("Fetched coordinates:", lat, lon);
    return { lat, lon };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
}

function prepCurrentWeatherURL(lat, lon) {
  return `${URLBase}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;
}

function prepForecastURL(lat, lon) {
  return `${URLBase}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;
}

async function fetchCurrentWeather(url) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);

    xhttp.onload = function () {
      if (xhttp.status === 200) {
        const data = JSON.parse(xhttp.responseText);
        resolve(data);
      } else {
        reject("Error fetching current weather data.");
      }
    };

    xhttp.onerror = function () {
      reject("Network error");
    };

    xhttp.send();
  });
}

async function fetchForecast(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }
}

function displayCurrentWeather(data) {
  const currentWeatherI = new CurrentWeatherInterface();
  currentWeatherI.update(data);
}

function displayForecast(data) {
  const forecastI = new ForecastInterface();
  forecastI.update(data);
}
