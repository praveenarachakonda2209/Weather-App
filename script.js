const apiKey = 'e7cd87ec7049c2fd8ca82ab7aed1868b';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const toggleUnitButton = document.getElementById('toggleUnitButton');
const descriptionElement = document.getElementById('description');
const windElement = document.getElementById('wind');
const errorMessageElement = document.getElementById('error-message');
const loadingElement = document.getElementById('loading');

let currentTempCelsius = null;
let isCelsius = true;

searchButton.addEventListener('click', searchWeather);
locationInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') searchWeather();
});

toggleUnitButton.addEventListener('click', () => {
  if (currentTempCelsius === null) return;

  if (isCelsius) {
    const fahrenheit = (currentTempCelsius * 9 / 5) + 32;
    temperatureElement.textContent = `${Math.round(fahrenheit)}°F`;
    toggleUnitButton.textContent = 'Show in °C';
  } else {
    temperatureElement.textContent = `${Math.round(currentTempCelsius)}°C`;
    toggleUnitButton.textContent = 'Show in °F';
  }
  isCelsius = !isCelsius;
});

function searchWeather() {
  const location = locationInput.value.trim();
  if (location) {
    fetchWeather(location);
  } else {
    showError("Please enter a city name.");
  }
}

function fetchWeather(location) {
  const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

  clearDisplay();
  loadingElement.style.display = 'block';

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found.");
      }
      return response.json();
    })
    .then(data => {
      currentTempCelsius = data.main.temp;
      isCelsius = true;

      locationElement.textContent = data.name;
      temperatureElement.textContent = `${Math.round(currentTempCelsius)}°C`;
      toggleUnitButton.style.display = 'inline-block';
      toggleUnitButton.textContent = 'Show in °F';
      descriptionElement.textContent = capitalize(data.weather[0].description);
      windElement.textContent = `Wind: ${data.wind.speed} m/s`;
    })
    .catch(error => {
      showError(error.message);
    })
    .finally(() => {
      loadingElement.style.display = 'none';
    });
}

function clearDisplay() {
  locationElement.textContent = '';
  temperatureElement.textContent = '';
  toggleUnitButton.style.display = 'none';
  descriptionElement.textContent = '';
  windElement.textContent = '';
  errorMessageElement.textContent = '';
}

function showError(message) {
  errorMessageElement.textContent = message;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
