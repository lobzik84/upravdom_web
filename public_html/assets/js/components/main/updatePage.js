import moment from 'moment';
import commonData from '../common/commonData';
import updateBattery from '../battery/updateBattery';
import updateWeather from '../weather/updateWeather';
import updateNotifications from '../notifications/updateNotifications';

function updatePage(data) {
  try {
    if (DEBUG) {
      console.log('updating page');
    }

    const dataJSON = JSON.parse(data.plain);
    const notificationsJSON = JSON.parse(data.notificationsPlain);

    updateBattery(dataJSON);

    updateWeather(dataJSON);

    if (notificationsJSON.length) {
      updateNotifications(notificationsJSON);
    }

    if (DEBUG) {
      console.log('notificationsJSON', notificationsJSON);
    }

    if (dataJSON.mode === 'ARMED') {
      $('#mode__security').addClass('dashboard-mode__item_changed');
      $('#mode__master').removeClass('dashboard-mode__item_changed');
    } else if (dataJSON.mode === 'IDLE') {
      $('#mode__master').addClass('dashboard-mode__item_changed');
      $('#mode__security').removeClass('dashboard-mode__item_changed');
    }

    $('#status__value--box_time').data('time', dataJSON.box_time).text(moment(+dataJSON.box_time).format(commonData.format));

    for (const key in dataJSON) {
      try {
        const lastValue = dataJSON[key]['last_value'];
        const $elementKey = $(`#status__value--${key}`);

        if ($elementKey) {
          if (dataJSON[key]['par_type'] === 'DOUBLE' || dataJSON[key]['par_type'] === 'INTEGER') {
            $elementKey.text(lastValue);
          } else if (dataJSON[key]['par_type'] === 'BOOLEAN') {
            if (lastValue.toString().toLowerCase() === 'true') {
              $elementKey.find('.panel__svg').addClass('panel__svg_color');
            } else {
              $elementKey.find('.panel__svg').removeClass('panel__svg_color');
            }
          }

          if (dataJSON[key]['state'] === 'ALARM') {
            if (DEBUG) {
              console.log(`Alert param ${key}`);
            }
            $elementKey.closest('.panel-item').addClass('panel-item_alarm');
          } else {
            $elementKey.closest('.panel-item').removeClass('panel-item_alarm')
          }
        }
        if (key === 'SOCKET' || key === 'LAMP_1' || key === 'LAMP_2') {
          if (lastValue.toString().toLowerCase() === 'true') {
            $(`#${key}-status`).addClass('control-item_on').removeClass('control-item_off')
              .find('.control__description')
              .text('Включена');
          } else {
            $(`#${key}-status`).addClass('control-item_off').removeClass('control-item_on')
              .find('.control__description')
              .text('Выключена');
          }
        }
      } catch (errors) {
        console.error(errors);
      }
    }

    if (DEBUG) {
      console.log('page updated');
    }
  } catch (errors) {
    console.error(errors);
  }
}

export default updatePage;
