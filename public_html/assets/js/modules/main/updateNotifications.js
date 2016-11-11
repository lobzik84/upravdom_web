import nunjucks from 'nunjucks';
import moment from 'moment';

import sendCommand from '../common/sendCommand';

const updateNotifications = (oldList) => {
  const list = oldList.map((item) => {
    const newItem = {
      startDate: moment(+item.startDate).format('DD.MM.YYYY, HH:mm'),
      endDate: moment(+item.endDate).format('HH:mm'),
    };
    return Object.assign(item, newItem);
  });
  const notifications = {
    list,
  };

  const $template = $(nunjucks.render('notifications.html', notifications));

  $template.find('.notifications-item').on('click', (e)=> {
    const $target = $(e.currentTarget);
    const commandData = {
      notifications_id: $target.data('id'),
    }
    sendCommand('delete_web_notification', commandData, null);
    $target.remove();
  })

  if ($('#notifications').length) {
    return;
  }
  $('#notifications').remove();
  $('body').prepend($template);
};

export default updateNotifications;
