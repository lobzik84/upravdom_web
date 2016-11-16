import moment from 'moment';
import Iscroll from 'iscroll';
import nunjucks from 'nunjucks';

import commonData from '../common/commonData';


const updateLog = (data) => {
  const dataJSON = JSON.parse(data.plain);

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

console.log(dataJSON.recs);

  nunjucks.render('history-list.html', logJSON, (err, res) => {
    $('.history-log').empty().append(res);
    if ($('#history-scroll').length) {
      new Iscroll('#history-scroll', {
        mouseWheel: true,
        scrollbars: 'custom',
        interactiveScrollbars: true,
        shrinkScrollbars: 'scale',
      });
    }
  });
};

export default updateLog;
