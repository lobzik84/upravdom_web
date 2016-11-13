import nunjucks from 'nunjucks';
import moment from 'moment';

import sendCommand from '../common/sendCommand';
import commonData from '../common/commonData';

const updateNotifications = (oldList) => {
  const list = oldList.map((item) => {
    const newItem = {
      startDate: moment(+item.startDate).format(commonData.fullFormat),
      endDate: moment(+item.endDate).format(commonData.format),
    };
    return Object.assign(item, newItem);
  });
  const notifications = {
    list,
  };
  const remove = ($item) => {
    $item.on('click', (e) => {
      const $closest = $(e.currentTarget).closest('.notifications-item');
      const $count = $('body').find('.dashboard-info__count');
      const commandData = {
        notification_id: $closest.data('id'),
      };
      sendCommand('delete_web_notification', commandData, () => {
        $count.text(parseInt($count.text(), 10) - 1);
        $closest.remove();
      });
    });
  };

  if ($('body').find('#notifications').length) {
    const updater = list.map((item) => {
      if (!$('#notifications').find(`.notifications-item[data-id="${item.id}"]`).length) {
        return item;
      }
      return false;
    });

    updater.forEach((item) => {
      if (item) {
        const $count = $('body').find('.dashboard-info__count');
        const $element = $(nunjucks.render('notifications-item.html', { item }));

        $count.text(parseInt($count.text(), 10) + 1);
        $('.notifications-list').append($element);
        remove($element);
      }
    });
  } else {
    const $template = $(nunjucks.render('notifications.html', notifications));

    remove($template.find('.notifications__icon_close'));

    $('body').prepend($template);
  }
};

export default updateNotifications;
