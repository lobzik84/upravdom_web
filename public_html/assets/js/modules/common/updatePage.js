import settings from './settings';

function updatePage(data) {
  try {
    if (DEBUG) {
      console.log('updating page');
    }

    const json = JSON.parse(data);

    if (json.mode === 'ARMED') {
      $('#mode__security').addClass('dashboard-mode__item_changed');
      $('#mode__master').removeClass('dashboard-mode__item_changed');
    } else if (json.mode === 'IDLE') {
      $('#mode__master').addClass('dashboard-mode__item_changed');
      $('#mode__security').removeClass('dashboard-mode__item_changed');
    }

    for (const key in json) {
      try {
        const lastValue = json[key]['last_value'];
        const $elementKey = $(`#status__value--${key}`);

        if ($elementKey) {
          if (json[key]['par_type'] === 'DOUBLE' || json[key]['par_type'] === 'INTEGER') {
            $elementKey.text(lastValue);
          } else if (json[key]['par_type'] === 'BOOLEAN') {
            if (lastValue.toString().toLowerCase() === 'true') {
              $elementKey.closest('panel-item').addClass('panel-item_alarm');
            } else {
              $elementKey.closest('panel-item').removeClass('panel-item_alarm');
            }
          }
          if (json[key]['state'] === 'Alert') {
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
