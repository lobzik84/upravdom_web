const updateConnection = (data) => {
  var svgStatus = '';

  if (data) {
    if (data.connection_type === 'remote') {
      $('#settings-item-change-password').hide();
      if (data.box_link === 'up') {
        svgStatus = '<svg class="dashboard-keys__svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="sprite.svg#box-success-remote-up"></use></svg>';
      } else {
        svgStatus = '<svg class="dashboard-keys__svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="sprite.svg#box-success-remote-down"></use></svg>';
      }
    } else if (data.connection_type === 'local') {
      $('#settings-item-change-password').show();
      if (data.box_link === 'up') {
        svgStatus = '<svg class="dashboard-keys__svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="sprite.svg#box-success-local-up"></use></svg>';
      } else {
        svgStatus = '<svg class="dashboard-keys__svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="sprite.svg#box-success-local-down"></use></svg>';
      }
    }
  } else {
    svgStatus = '<svg class="dashboard-keys__svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="sprite.svg#box-fail"></use></svg>';
  }

  $('.dashboard-keys').empty().append(svgStatus);
};

export default updateConnection;
