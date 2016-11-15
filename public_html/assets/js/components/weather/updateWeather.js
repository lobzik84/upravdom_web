import moment from 'moment';

function updateWeather(dataJSON) {
  try {
    const allClass = 'panel-item_weather-sun panel-item_weather-night panel-item_weather-night-cloudly panel-item_weather-cloudly panel-item_weather-sun-cloudly panel-item_weather-cloudly panel-item_weather-snow panel-item_weather-rain';
    const mounth = moment(dataJSON.box_time).format('MM');
    const hour = moment(dataJSON.box_time).format('HH');
    const medium = dataJSON.CLOUDS > 20 && dataJSON.CLOUDS < 70;
    const hard = dataJSON.CLOUDS >= 70;
    const precipitation = dataJSON.RAIN > 1;

    let weatherClass = 'panel-item_weather-sun';
    let title = `Погода и температура на улице ${dataJSON.OUTSIDE_TEMP.last_value} &deg;`;

    if ((dataJSON.NIGHTTIME && dataJSON.NIGHTTIME.last_value === 'true') || hour > 21 || hour < 8) {
      weatherClass = 'panel-item_weather-night';
      title = `Ясно, температура на улице ${dataJSON.OUTSIDE_TEMP.last_value} &deg;`;
      if (medium) {
        weatherClass = 'panel-item_weather-night-cloudly';
        title = `Ночь, слабо облачно, температура на улице ${dataJSON.OUTSIDE_TEMP.last_value} &deg;`;
      } else if (hard) {
        weatherClass = 'panel-item_weather-cloudly';
        title = `Облачно, температура на улице ${dataJSON.OUTSIDE_TEMP.last_value} &deg;`;
      }
    } else {
      weatherClass = 'panel-item_weather-sun';
      title = `Ясно, температура на улице ${dataJSON.OUTSIDE_TEMP.last_value} &deg;`;
      if (medium) {
        weatherClass = 'panel-item_weather-sun-cloudly';
        title = `День, слабо облачно, температура на улице ${dataJSON.OUTSIDE_TEMP.last_value} &deg;`;
      } else if (hard) {
        weatherClass = 'panel-item_weather-cloudly';
        title = `Облачно, температура на улице ${dataJSON.OUTSIDE_TEMP.last_value} &deg;`;
      }
    }
    if (precipitation) {
      weatherClass = mounth > 10 || mounth < 3 ? 'panel-item_weather-snow' : 'panel-item_weather-rain';
    }

    $('#weather').closest('.panel-item_weather').removeClass(allClass).addClass(weatherClass)
    .attr('title', title);
  } catch (e) {
    console.error('Failed to update weather');
  }
}
export default updateWeather;
