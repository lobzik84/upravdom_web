import moment from 'moment';
import settings from '../common/settings';


const updateHistory = (data) => {
  const dataJSON = JSON.parse(data.plain);
  const history = [
    {
      name: 'label',
      className: 'history-chart__line history-chart__line_label',
      data: [
        { x: dataJSON.from, y: 0 },
        { x: dataJSON.to, y: 0 },
      ],
    },
  ];

  dataJSON.list.forEach((item) => {
    const newItem = {
      name: item.alias,
      className: `history-chart__line history-chart__line_${item.alias}`,
    };
    newItem.data = [];
    item.data.forEach((itemData) => {
      const newData = {
        x: itemData.x,
        y: itemData.y,
        meta: `${moment(+itemData.x).format(settings.fullFormat)}?${item.description ? item.description : ''}?${parseInt(itemData.y, 10)}`,
      };
      newItem.data.push(newData);
    });
    history.push(newItem);
  });

  if (DEBUG) {
    console.log('newHistory', history);
    console.log('updateHistory', dataJSON);
  }

  if ($('.history-chart').length) {
    new Chartist.Line('.history-chart', {
      series: history,
    }, {
      plugins: [
        Chartist.plugins.tooltip({
          tooltipFnc(value) {
            const splitValue = value.split('?');
            return `<span class="chartist-tooltip__time">${splitValue[0]}</span>
            <span class="chartist-tooltip__name">${splitValue[1]}</span>
            <span class="chartist-tooltip__value">${splitValue[2]}</span>`;
          },
          transformTooltipTextFnc() {
            return '';
          },
        }),
      ],
      axisX: {
        type: Chartist.FixedScaleAxis,
        divisor: 24,
        labelInterpolationFnc(value) {
          return moment(value).format('HH:mm');
        },
      },
      axisY: {
        labelInterpolationFnc() {
          return '';
        },
      },
    });
  }
};

export default updateHistory;
