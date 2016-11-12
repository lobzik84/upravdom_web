import moment from 'moment';
import Iscroll from 'iscroll';
import nunjucks from 'nunjucks';

import historySPEC from '../history/historySPEC'; //  временный статичный json для истории


const updateLog = (data) => {
  console.log(data);

  $('.history-log').empty().append(nunjucks.render('history-list.html', historySPEC));

  new Iscroll('#history-scroll', {
    mouseWheel: true,
    scrollbars: 'custom',
    interactiveScrollbars: true,
    shrinkScrollbars: 'scale',
  });
};

export default updateLog;
