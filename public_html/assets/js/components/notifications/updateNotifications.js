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
  const removeEvent = ($item) => {
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

    if (updater.length) {
      updater.forEach((item) => {
        if (item) {
          $(nunjucks.render('notifications-item.html', { item }, (err, res) => {
            const $element = $(res);
            removeEvent($element.find('.notifications__icon_close'));
            $('.notifications-list').append($element);
          }));
        }
      });
    }
  } else {
    const $template = $(nunjucks.render('notifications.html', notifications));
    removeEvent($template.find('.notifications__icon_close'));
    $('body').prepend($template);
  }
};

export default updateNotifications;
