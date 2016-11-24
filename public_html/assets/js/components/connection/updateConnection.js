const updateConnection = (data) => {
  let svgStatus = '';
  const keysName = 'dashboard-keys';
  const downed = () => {
    $('.panel__svg-update').addClass('panel__svg-update_hide');
    $('.panel-count').addClass('panel-count_hide');
  };

  if (data) {
    if (data.connection_type === 'remote') {
      $('#settings-item-change-password').hide();
      if (data.box_link === 'up') {
        svgStatus = `${keysName}_remote-up`;
      } else {
        svgStatus = `${keysName}_remote-down`;

        downed();
      }
    } else if (data.connection_type === 'local') {
      $('#settings-item-change-password').show();
      if (data.server_link === 'up') {
        svgStatus = `${keysName}_local-up`;
      } else {
        svgStatus = `${keysName}_local-down`;

        downed();
      }
    }
  } else {
    svgStatus = `${keysName}_fail`;
  }

  $('.dashboard-keys').removeClass(`${keysName}_fail ${keysName}_local-down ${keysName}_local-up ${keysName}_remote-down ${keysName}_remote-up`).addClass(svgStatus);
};

export default updateConnection;
