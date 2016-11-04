import debounce from 'debounce';
import sendCommand from '../common/sendCommand';


class SettingEvents {
  constructor($target, element) {
    $target.on('click', (event) => {
      const sign = element === 'plus' ? '+' : '-';
      SettingEvents.switchMinMax(event.currentTarget, sign);
    }).on('click', debounce(() => {
      SettingEvents.sendSettings();
    }, 300));
  }

  static switchMinMax(currentTarget, sign) {
    const $target = $(currentTarget);
    const $valueBlock = $target.siblings('.settings-options__value').children('b');
    const count = $valueBlock[0].id === 'settings__value--VACAlertMin' || $valueBlock[0].id === 'settings__value--VACAlertMax' ? 5 : 1;
    let value = parseInt($valueBlock.text().replace(/[^-0-9]/gim, ''), 10);

    if (sign === '+') {
      value += count;
    } else if (sign === '-') {
      value -= count;
    }

    $valueBlock.text(value);
    if (DEBUG) {
      console.log('Saving settings');
    }
  }

  static sendSettings() {
    const settingElementIdPrefix = 'settings__value--';
    const settings = {};
    const $settings = $(`[id^="${settingElementIdPrefix}"]`);

    $settings.each((index, setting) => {
      const settingName = setting.id.replace(settingElementIdPrefix, '');

      settings[settingName] = setting.innerHTML;
      if (DEBUG) {
        console.log(`${settingName} - ${setting.innerHTML}`);
      }
    });

    sendCommand('save_settings', { settings }, null);
  }
}

export default SettingEvents;
