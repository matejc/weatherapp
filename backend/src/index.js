const debug = require('debug')('weathermap');

const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || '';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

const fetchWeather = async (latitude, longitude) => {
  const endpoint = `${mapURI}/weather?lat=${latitude}&lon=${longitude}&appid=${appId}`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

const fetchForecast = async (latitude, longitude) => {
  const endpoint = `${mapURI}/forecast?lat=${latitude}&lon=${longitude}&appid=${appId}`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  const { latitude, longitude, } = ctx.query;
  const weatherData = await fetchWeather(latitude, longitude);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = {
    name: weatherData.name,
    weather: weatherData.weather ? weatherData.weather[0] : {},
  };
});

router.get('/api/forecast', async ctx => {
  const { latitude, longitude, } = ctx.query;
  const forecastData = await fetchForecast(latitude, longitude);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = {
    name: forecastData.city.name,
    forecast: [],
  };

  for (const item of forecastData.list.splice(0, 5)) {
    ctx.body.forecast.push(item.weather ? item.weather[0] : {});
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

debug(`App listening on port ${port}`);
