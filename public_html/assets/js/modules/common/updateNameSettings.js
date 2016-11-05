function updateNameSettings(name, value) {
  const $nameElement = $(`#name--${name}`);
  if ($nameElement.length) {
    $nameElement.html(value);
  }
}

export default updateNameSettings;
