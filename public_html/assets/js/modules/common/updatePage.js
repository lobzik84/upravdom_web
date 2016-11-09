import moment from 'moment';
import settings from './settings';
import updateNotifications from '../main/updateNotifications';

function updatePage(data) {
  try {
    if (DEBUG) {
      console.log('updating page');
    }

    const dataPlain = JSON.parse(data.plain);
    const notificationsPlain = JSON.parse(data.notificationsPlain);

    if (notificationsPlain.length) {
      $('.dashboard-info__count').text(notificationsPlain.length);
      updateNotifications(notificationsPlain);
    }

    if (DEBUG) {
      console.log('notificationsPlain', notificationsPlain);
    }

    if (dataPlain.mode === 'ARMED') {
      $('#mode__security').addClass('dashboard-mode__item_changed');
      $('#mode__master').removeClass('dashboard-mode__item_changed');
    } else if (dataPlain.mode === 'IDLE') {
      $('#mode__master').addClass('dashboard-mode__item_changed');
      $('#mode__security').removeClass('dashboard-mode__item_changed');
    }

    $('#status__value--box_time').text(moment(+dataPlain.box_time).format(settings.format));

    for (const key in dataPlain) {
      try {
        const lastValue = dataPlain[key]['last_value'];
        const $elementKey = $(`#status__value--${key}`);

        if ($elementKey) {
          if (dataPlain[key]['par_type'] === 'DOUBLE' || dataPlain[key]['par_type'] === 'INTEGER') {
            $elementKey.text(lastValue);
          } else if (dataPlain[key]['par_type'] === 'BOOLEAN') {
            if (lastValue.toString().toLowerCase() === 'true') {
              $elementKey.closest('panel-item').addClass('panel-item_alarm');
            } else {
              $elementKey.closest('panel-item').removeClass('panel-item_alarm');
            }
          }
          if (dataPlain[key]['state'] === 'Alert') {
            if (DEBUG) {
              console.log(`Alert param ${key}`);
            }
            $elementKey.closest('panel-item').addClass('panel-item_alarm');
          }
        }
        if (key === 'SOCKET' || key === 'LAMP_1' || key === 'LAMP_2') {
          if (lastValue.toString().toLowerCase() === 'true') {
            $(`#${key}-status`).addClass('control-item_on').removeClass('control-item_off')
              .find('.control__description')
              .text('Включена');
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
