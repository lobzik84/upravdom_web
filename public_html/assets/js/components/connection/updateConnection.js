import nunjucks from 'nunjucks';

import SettingsEvents from '../settings/settingsEvents';

const updateConnection = (data) => {
  var svgStatus = '';

  if (data) {
    if (data.connection_type === 'remote') {
      if (data.box_link === 'up') {
        svgStatus = '<svg class="dashboard-keys__svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="sprite.svg#box-success-remote-up"></use></svg>';
      } else {
        svgStatus = '<svg class="dashboard-keys__svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="sprite.svg#box-success-remote-down"></use></svg>';
      }
    } else if (data.connection_type === 'local') {
      if ($('body').find('#settings-item-change-password').length === 0) {
        const $template = $(nunjucks.render('settings-item-change-password.html'));
        new SettingsEvents($template.find('#changePassword'));
        $('.settings-list').append($template);
      }
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
