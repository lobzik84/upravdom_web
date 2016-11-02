import settings from './settings';

function updatePage(data) {
  try {
    if (settings.print_debug_to_console) {
      console.log('updating page');
    }

    const json = JSON.parse(data);

    if (json.mode === 'ARMED') {
      $('#mode__security').addClass('dashboard-mode__item_changed');
      $('#mode__master').removeClass('dashboard-mode__item_changed');
      $('#mode__current').text('Охрана');
    } else if (json.mode === 'IDLE') {
      $('#mode__master').addClass('dashboard-mode__item_changed');
      $('#mode__security').removeClass('dashboard-mode__item_changed');
      $('#mode__current').text('Хозяин Дома');
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
              $elementKey.addClass('panel-item_alarm');
            } else {
              $elementKey.removeClass('panel-item_alarm');
            }
          }
          if (json[key]['state'] === 'Alert') {
            console.log(`Alert param ${key}`);
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

    if (settings.print_debug_to_console) {
      console.log('page updated');
    }
  } catch (errors) {
    console.error(errors);
  }
}

export default updatePage;
