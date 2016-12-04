import moment from 'moment';
import Iscroll from 'iscroll';
import nunjucks from 'nunjucks';
import loadLog from './loadLog';

import checkDevice from '../common/checkDevice';
import commonData from '../common/commonData';


const updateLog = (data) => {
  const dataJSON = JSON.parse(data.plain);
  const time = $('#status__value--box_time').data('time');
  const timeInterval = +time - 3 * 24 * 60 * 60 * 1000;

  if (DEBUG) {
    console.log('updateLog', dataJSON);
  }

  const logJSON = {
    recs: [],
  };
  dataJSON.recs.forEach((item) => {
    const rec = {
      date: moment(item.date).utcOffset(commonData.utc).format(commonData.fullFormat),
      severity: item.severity,
      text: item.text,
      parameterAlias: item.alias,
    };
    logJSON.recs.push(rec);
  });

  nunjucks.render('history-list.html', logJSON, (err, res) => {
    $('.history-log').empty().append(res);
    $('.history-log').prepend('<div class="history-log__disabled"></div>');
    if ($('#history-scroll').length) {
      let scroll = false;
      if (checkDevice() === 'desktop') {
        scroll = new Iscroll('#history-scroll', {
          disablePointer: true,
          scrollbars: 'custom',
          interactiveScrollbars: true,
          shrinkScrollbars: 'scale',
        });
      } else {
        scroll = new Iscroll('#history-scroll', {
          disablePointer: true,
          interactiveScrollbars: true,
          shrinkScrollbars: 'scale',
        });
      }

      if (scroll) {
        scroll.on('scrollEnd', () => {
          if (scroll.y === -0) {
            scroll.destroy();
            loadLog(timeInterval, +time, 'LogModule', 'INFO');
          }
        });
      }
    }
  });
};

export default updateLog;
