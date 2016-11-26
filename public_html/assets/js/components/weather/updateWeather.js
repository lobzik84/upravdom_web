import moment from 'moment';

import commonData from '../common/commonData';

const updateWeather = (dataJSON) => {
  try {
    const allClass = 'panel-item_weather-sun panel-item_weather-night panel-item_weather-night-cloudly panel-item_weather-cloudly panel-item_weather-sun-cloudly panel-item_weather-cloudly panel-item_weather-snow panel-item_weather-rain';
    const hour = moment(dataJSON.box_time).utcOffset(commonData.utc).format('HH');
    const medium = dataJSON.CLOUDS.last_value > 20 && dataJSON.CLOUDS.last_value < 70;
    const hard = dataJSON.CLOUDS.last_value >= 70;
    const precipitation = dataJSON.RAIN.last_value > 1;
    const outsideTemperature = `${dataJSON.OUTSIDE_TEMP.last_value} &deg;`;

    let weatherClass = 'panel-item_weather-sun';
    let title = `Погода и температура на улице ${outsideTemperature}`;

    if ((dataJSON.NIGHTTIME && dataJSON.NIGHTTIME.last_value === 'true') || hour > 21 || hour < 8) {
      weatherClass = 'panel-item_weather-night';
      title = `Ясно, температура на улице ${outsideTemperature}`;
      if (medium) {
        weatherClass = 'panel-item_weather-night-cloudly';
        title = `Ночь, слабо облачно, температура на улице ${outsideTemperature}`;
      } else if (hard) {
        weatherClass = 'panel-item_weather-cloudly';
        title = `Облачно, температура на улице ${outsideTemperature}`;
      }
    } else if (medium) {
      weatherClass = 'panel-item_weather-sun-cloudly';
      title = `День, слабо облачно, температура на улице ${outsideTemperature}`;
    } else if (hard) {
      weatherClass = 'panel-item_weather-cloudly';
      title = `Облачно, температура на улице ${outsideTemperature}`;
    }
    if (precipitation) {
      weatherClass = dataJSON.OUTSIDE_TEMP.last_value < 0 ? 'panel-item_weather-snow' : 'panel-item_weather-rain';
    }

    $('#weather').closest('.panel-item_weather').removeClass(allClass).addClass(weatherClass)
    .attr('title', title);
  } catch (e) {
    console.error('Failed to update weather');
  }
};
export default updateWeather;
