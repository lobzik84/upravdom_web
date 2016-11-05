function updateSettings(data) {
  try {
    const json = data;

    for (const key in json) {
      try {
        if (DEBUG) {
          console.log(`loading settings ${key}`);
        }

        const val = json[key];
        const $elementKey = $(`#settings__value--${key}`);

        if ($elementKey.length) {
          if ($elementKey[0].type === 'checkbox') {
            $elementKey.attr('checked', val === 'true' ? 'checked' : false);
          } else if ($elementKey[0].type === 'text') {
            $elementKey.val(val);
          } else {
            $elementKey.html(val);
          }
        }
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
