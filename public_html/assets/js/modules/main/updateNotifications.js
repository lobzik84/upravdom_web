import nunjucks from 'nunjucks';
import moment from 'moment';


const updateNotifications = (json) => {
  const notifications = {
    list: json,
  };

  const $template = $(nunjucks.render('notifications.html', notifications));

  $('#notifications').remove();
  $('body').prepend($template);
};

export default updateNotifications;
