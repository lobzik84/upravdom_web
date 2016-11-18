import moment from 'moment';
import Iscroll from 'iscroll';
import nunjucks from 'nunjucks';
import loadLog from './loadLog';

import commonData from '../common/commonData';


const updateLog = (data) => {
  const dataJSON = JSON.parse(data.plain);
  const time = $('#status__value--box_time').data('time');
  const timeInterval = +time - 3 * 24 * 60 * 60 * 1000;

  console.log('загрузка лоада');

  if (DEBUG) {
    console.log('updateLog', dataJSON);
  }

  const logJSON = {
    recs: [],
  };
  dataJSON.recs.forEach((item) => {
    const rec = {
      date: moment(item.date).format(commonData.fullFormat),
      severity: item.severity,
      text: item.text,
      parameterAlias: item.alias,
    };
    logJSON.recs.push(rec);
  });

  nunjucks.render('history-list.html', logJSON, (err, res) => {
    $('.history-log').empty().append(res);
    if ($('#history-scroll').length) {
      const scroll = new Iscroll('#history-scroll', {
        mouseWheel: true,
        scrollbars: 'custom',
        interactiveScrollbars: true,
        shrinkScrollbars: 'scale',
      });

      scroll.on('scrollEnd', () => {
        if (scroll.y === -0) {
          scroll.destroy();
          loadLog(timeInterval, +time, 'InstinctsModule', 'INFO');
        }
      });
    }
  });
};

export default updateLog;
