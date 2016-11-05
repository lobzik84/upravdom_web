import updateNameSettings from './updateNameSettings';


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
          } else if ($settingsElement[0].type === 'text') {
            $settingsElement.val(val);
          } else {
            $settingsElement.html(val);
          }
        }
        updateNameSettings(key, val);
      } catch (ee) {
        console.error(ee);
      }
    }

    console.log('settings loaded');
  } catch (e) {
    console.error(e);
  }
}

export default updateSettings;
