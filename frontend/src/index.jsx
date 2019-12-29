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

    const forecast = [];
    forecast.push(forecastData.forecast[0].icon.slice(0, -1));
    forecast.push(forecastData.forecast[1].icon.slice(0, -1));
    forecast.push(forecastData.forecast[2].icon.slice(0, -1));
    forecast.push(forecastData.forecast[3].icon.slice(0, -1));
    forecast.push(forecastData.forecast[4].icon.slice(0, -1));

    this.setState({
      name: weatherData.name,
      weather: weatherData.weather.icon.slice(0, -1),
      temp: weatherData.temp,
      forecast,
    });
  }

  render() {
    const { name, weather, temp, forecast } = this.state;

    return (
      <div className="container">
        <div className="location">
          { name }
        </div>
        <div className="icon">
          { weather && <img alt="N/A" src={`/img/${weather}.svg`} /> }
        </div>
        <div className="temperature">
          { weather && `${temp} °C` }
        </div>
        <div className="forecast-container">
          { forecast[0] && <div><img alt="N/A" src={`/img/${forecast[0]}.svg`} /><div>+ 3 h</div></div> }
          { forecast[1] && <div><img alt="N/A" src={`/img/${forecast[1]}.svg`} /><div>+ 6 h</div></div> }
          { forecast[2] && <div><img alt="N/A" src={`/img/${forecast[2]}.svg`} /><div>+ 9 h</div></div> }
          { forecast[3] && <div><img alt="N/A" src={`/img/${forecast[3]}.svg`} /><div>+ 12 h</div></div> }
          { forecast[4] && <div><img alt="N/A" src={`/img/${forecast[4]}.svg`} /><div>+ 15 h</div></div> }
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
