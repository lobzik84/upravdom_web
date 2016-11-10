import nunjucks from 'nunjucks';
import moment from 'moment';


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

  if ($('#notifications').length) {
    return;
  }
  $('#notifications').remove();
  $('body').prepend($template);
};

export default updateNotifications;
