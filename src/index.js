const BASE_URL = 'https://ada-weather-report-proxy-server.onrender.com';
// const BASE_URL = 'http://localhost:5000';

const state = {
  city: 'Seattle',
  temp: 72,
  skySelect: null,
  skyContainer: null,
  gardenContainer: null,
  landscapeContainer: null,
  tempContainer: null,
  cityNameInput: null,
  headerCityName: null,
};

const skyTypes = {
  cloudy: {
    sky: '☁️☁️ ☁️ ☁️☁️ ☁️ 🌤 ☁️ ☁️☁️',
    skyColor: 'cloudy'
  },
  sunny: {
    sky: '☁️     ☁️   ☁️ ☀️ ☁️  ☁️',
    skyColor: 'sunny'
  },
  rainy: {
    sky: '🌧🌈⛈🌧🌧💧⛈🌧🌦🌧💧🌧🌧',
    skyColor: 'rainy'
  },
  snowy: {
    sky: '🌨❄️🌨🌨❄️❄️🌨❄️🌨❄️❄️🌨🌨',
    skyColor: 'snowy'
  }
};

const gardenSettings = {
  red:  '🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂',
  orange:  '🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃',
  yellow: '🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷',
  green: '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲',
  teal: '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲',
};

const displayTemperatureFromLocation = () => {
  findLatAndLong()
    .then((coords) => {
      getTemperature(coords)
        .then((temperature) => {
          state.temp = Math.round(convertKtoF(temperature));;
          formatTempAndGarden();
        });
    })
    .catch((error) => {
      console.log('Error getting weather from location:', error);
    });
}

const findLatAndLong = () => {
  return axios
    .get(`${BASE_URL}/location`, {
      params: {
        q: state.city,
      },
    })
    .then((response) => {
      const lat = response.data[0].lat;
      const long = response.data[0].lon;
      return { lat, long };
    })
    .catch((error) => {
      console.log('Error finding the latitude and longitude:', error.response);
    });
};

const getTemperature = (coords) => {
  return axios
    .get(`${BASE_URL}/weather`, {
      params: {
        lat: coords.lat,
        lon: coords.long,
      },
    })
    .then((response) => {
      const weather = response.data;
      return weather.main.temp;
    })
    .catch((error) => {
      console.log('Error getting the weather:', error);
    });
};

const convertKtoF = (temp) => {
  return (temp - 273.15) * (9 / 5) + 32;
};

const updateSky = () => {
  const inputSky = state.skySelect.value;
  const skySettings = skyTypes[inputSky.toLowerCase()];
  const skyColor = skySettings.skyColor;

  state.skyContainer.textContent = skySettings.sky;
  state.gardenContainer.classList = `garden__content ${skyColor}`;
};

const updateCityName = () => {
  state.city = state.cityNameInput.value
  state.headerCityName.textContent = state.city;
};

const resetCityName = () => {
  state.cityNameInput.value = 'Seattle';
  updateCityName();
};

const formatTempAndGarden = () => {
  let temp = state.temp;
  let color = 'red';

  if (temp > 80) {
    color = 'red';
  } else if (temp > 70) {
    color = 'orange';
  } else if (temp > 60) {
    color = 'yellow';
  } else if (temp > 50) {
    color = 'green';
  } else {
    color = 'teal';
  }

  state.landscapeContainer.textContent = gardenSettings[color];
  state.tempContainer.className = color;
  state.tempContainer.textContent = String(state.temp);
};

const updateTemp = (changeInTemp) => {
  state.temp += changeInTemp;
  formatTempAndGarden();
};

const setUpPage = () => {
  lookUpElements();

  formatTempAndGarden();
  updateCityName();
  updateSky();

  registerEventHandlers();
};

const lookUpElements = () => {
  state.skySelect = document.getElementById('skySelect');
  state.skyContainer = document.getElementById('sky');
  state.gardenContainer = document.getElementById('gardenContent');
  state.landscapeContainer = document.getElementById('landscape');
  state.tempContainer = document.getElementById('tempValue');
  state.cityNameInput = document.getElementById('cityNameInput');
  state.headerCityName = document.getElementById('headerCityName');
}

const registerEventHandlers = () => {
  const currentTempButton = document.getElementById('currentTempButton');
  currentTempButton.addEventListener('click', displayTemperatureFromLocation);

  const increaseTempControl = document.getElementById('increaseTempControl');
  increaseTempControl.addEventListener('click', () => { updateTemp(1) });

  const decreaseTempControl = document.getElementById('decreaseTempControl');
  decreaseTempControl.addEventListener('click', () => { updateTemp(-1) });

  const cityNameResetBtn = document.getElementById('cityNameReset');
  cityNameResetBtn.addEventListener('click', resetCityName);

  state.cityNameInput.addEventListener('input', updateCityName);
  state.skySelect.addEventListener('change', updateSky);
};

document.addEventListener('DOMContentLoaded', setUpPage);