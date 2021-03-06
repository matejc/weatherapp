import React from 'react';
import ReactDOM from 'react-dom';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async (latitude, longitude) => {
  try {
    const response = await fetch(`${baseURL}/weather?latitude=${latitude}&longitude=${longitude}`);
    return response.json();
  } catch (error) {
    console.error(error);  // eslint-disable-line
  }

  return {};
};

const getForecastFromApi = async (latitude, longitude) => {
  try {
    const response = await fetch(`${baseURL}/forecast?latitude=${latitude}&longitude=${longitude}`);
    return response.json();
  } catch (error) {
    console.error(error);  // eslint-disable-line
  }

  return {};
};

const getLocation = async () => {
  const options = {
    maximumAge: 60000,
    timeout: 5000,
    enableHighAccuracy: true,
  };
  try {
    const loc = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
    if (loc && loc.latitude && loc.longitude) {
      return loc;
    } else {
      return null;
    }
  } catch (err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);  // eslint-disable-line
    return null;
  }
};

const getLocationByIpInfo = async () => {
  try {
    const response = await fetch('https://ipinfo.io/geo');
    const res = await response.json();
    const loc = res.loc.split(',');
    return { latitude: loc[0], longitude: loc[1] };
  } catch (error) {
    console.warn(error);  // eslint-disable-line
    return null;
  }
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      weather: '',
      forecast: [],
    };
  }

  async componentWillMount() {
    const loc = await getLocation() || await getLocationByIpInfo() || { latitude: 0, longitude: 0 };
    const weatherData = await getWeatherFromApi(loc.latitude, loc.longitude);
    const forecastData = await getForecastFromApi(loc.latitude, loc.longitude);

    const forecasts = [];
    for (let i = 0; i < forecastData.forecast.length; i++) {
        let forecast = forecastData.forecast[i];
        forecasts.push({
            icon: forecast.weather.icon.slice(0, -1),
            temp: Math.round(forecast.main.temp)
        });
    }

    this.setState({
      name: weatherData.name,
      weather: weatherData.weather.icon.slice(0, -1),
      temp: Math.round(weatherData.temp),
      forecast: forecasts,
    });
  }

  render() {
    const { name, weather, temp, forecast } = this.state;

    return (
      <div className="container">
        <div className="location">
          { name }
        </div>
        <div className="temperature">
          { weather && `${temp} °C` }
        </div>
        <div className="icon">
          { weather && <img alt="N/A" src={`/img/${weather}.svg`} /> }
        </div>
        <div className="forecast-container">
          { forecast[0] && <div><img alt="N/A" src={`/img/${forecast[0].icon}.svg`} /><div>{`${forecast[0].temp}°C`}</div></div> }
          { forecast[1] && <div><img alt="N/A" src={`/img/${forecast[1].icon}.svg`} /><div>{`${forecast[1].temp}°C`}</div></div> }
          { forecast[2] && <div><img alt="N/A" src={`/img/${forecast[2].icon}.svg`} /><div>{`${forecast[2].temp}°C`}</div></div> }
          { forecast[3] && <div><img alt="N/A" src={`/img/${forecast[3].icon}.svg`} /><div>{`${forecast[3].temp}°C`}</div></div> }
          { forecast[4] && <div><img alt="N/A" src={`/img/${forecast[4].icon}.svg`} /><div>{`${forecast[4].temp}°C`}</div></div> }
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
