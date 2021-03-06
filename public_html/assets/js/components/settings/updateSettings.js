import updateNameSettings from './updateNameSettings';
import commonData from '../common/commonData'; // global config!

function updateSettings(data) {
  try {
    const json = data;

    for (const key in json) {
      try {
        if (DEBUG) {
          console.log(`loading settings ${key}`);
        }

        const val = json[key];
        const $settingsElement = $(`#settings__value--${key}`);

        if ($settingsElement.length) {
          if ($settingsElement[0].type === 'checkbox') {
            $settingsElement.attr('checked', val === 'true' ? 'checked' : false);
          } else if ($settingsElement[0].type === 'text' || $settingsElement[0].type === 'email') {
            $settingsElement.val(val);
          } else {
            $settingsElement.html(val);
          }
        }
        updateNameSettings(key, val);
        if (key === 'UserLogin') {
          commonData.user_login = json[key]; // store login in global settings
        }
      } catch (ee) {
        console.error(ee);
      }
    }

    $('.settings-list_loaded').removeClass('settings-list_loaded');

    if (DEBUG) {
      console.log('settings loaded');
    }
  } catch (e) {
    console.error(e);
  }
}

export default updateSettings;
