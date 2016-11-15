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

    if ((dataJSON.NIGHTTIME && dataJSON.NIGHTTIME.last_value === 'true') || hour > 21 || hour < 8) {
      weatherClass = 'panel-item_weather-night';
      if (medium) {
        weatherClass = 'panel-item_weather-night-cloudly';
      } else if (hard) {
        weatherClass = 'panel-item_weather-cloudly';
      }
    } else {
      weatherClass = 'panel-item_weather-sun';
      if (medium) {
        weatherClass = 'panel-item_weather-sun-cloudly';
      } else if (hard) {
        weatherClass = 'panel-item_weather-cloudly';
      }
    }
    if (precipitation) {
      weatherClass = mounth > 10 || mounth < 3 ? 'panel-item_weather-snow' : 'panel-item_weather-rain';
    }

    $('#weather').closest('.panel-item_weather').removeClass(allClass).addClass(weatherClass);
  } catch (e) {
    console.error('Failed to update weather');
  }
}
export default updateWeather;
