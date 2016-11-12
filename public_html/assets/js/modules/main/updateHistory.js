import moment from 'moment';


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
        x: itemData.x, y: itemData.y, meta: item.description,
      };
      newItem.data.push(newData);
    });
    history.push(newItem);
  });

  if (DEBUG) {
    console.log('newHistory', history);
    console.log('updateHistory', dataJSON);
  }

  new Chartist.Line('.history-chart', {
    series: history,
  }, {
    plugins: [
      Chartist.plugins.tooltip(),
    ],
    axisX: {
      type: Chartist.FixedScaleAxis,
      divisor: 24,
      labelInterpolationFnc(value) {
        return moment(value).format('HH:mm');
      },
    },
    axisY: {
      offset: 80,
      labelInterpolationFnc() {
        return '';
      },
      scaleMinSpace: 15,
    },
  },
);
};

export default updateHistory;
