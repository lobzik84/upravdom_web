import moment from 'moment';


const updateHistory = (data) => {
  const dataJSON = JSON.parse(data.plain);
  const history = [
    {
      name: 'label',
      className: 'history-chart__line_label',
      data: [
        { x: new Date(dataJSON.from), у: 0 },
        { x: new Date(dataJSON.to), у: 0 },
      ],
    },
  ];

  dataJSON.list.forEach((item) => {
    const newItem = {
      name: item.alias,
    };
    newItem.data = [];
    item.data.forEach((itemData) => {
      const newData = {
        x: new Date(itemData.x), у: itemData.y, meta: item.description,
      };
      newItem.data.push(newData);
    });
    history.push(newItem);
  });

  if (DEBUG) {
    console.log('newHistory', history);
    console.log('updateHistory', dataJSON);
  }

  const chart = new Chartist.Line('.history-chart', {
    series: history,
  }, {
    plugins: [
      Chartist.plugins.tooltip(),
    ],
    axisX: {
      type: Chartist.FixedScaleAxis,
      divisor: 24,
      labelInterpolationFnc: (value) => {
        return moment(value).format('HH:mm');
      },
    },
    axisY: {
      onlyInteger: true,
      low: 0,
    },
  });
};

export default updateHistory;
