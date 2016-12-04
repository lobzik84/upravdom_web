const updateConnection = (data) => {
  let svgStatus = '';
  var altText = '';
  const keysName = 'dashboard-keys';
  const downed = () => {
    $('.panel__svg-update').addClass('panel__svg-update_hide');
    $('.panel-count').addClass('panel-count_hide');
  };

  if (data) {
    if (data.connection_type === 'remote') {
      $('#settings-item-change-password').addClass('settings-item_hide');

      if (data.box_link === 'up') {
        svgStatus = `${keysName}_remote-up`;
        altText = 'Вы подключены к Управдому через безопасное Интернет-соединение';
      } else {
        svgStatus = `${keysName}_remote-down`;
        altText = 'Нет связи с Управдомом.';
        downed();
      }
    } else if (data.connection_type === 'local') {
      $('#settings-item-change-password').removeClass('settings-item_hide');
      if (data.server_link === 'up') {
        svgStatus = `${keysName}_local-up`;
        altText = 'Вы подключены к Управдому через локальную сеть. Управдом подключен к Интернету.';
      } else {
        svgStatus = `${keysName}_local-down`;
        altText = 'Вы подключены к Управдому через локальную сеть. Управдом не подключен к Интернету.';
        downed();
      }
    }
  } else {
    svgStatus = `${keysName}_fail`;
    altText = 'Ошибка при подключении. Проверьте соединение с Интернетом.';
  }
  $('.dashboard-keys').attr('data-description', altText);
  $('.dashboard-keys').removeClass(`${keysName}_fail ${keysName}_local-down ${keysName}_local-up ${keysName}_remote-down ${keysName}_remote-up`).addClass(svgStatus);
};

export default updateConnection;
