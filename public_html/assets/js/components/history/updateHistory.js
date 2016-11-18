const updateHistory = (data) => {
  Highcharts.setOptions({
    lang: {
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      shortMonths: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
      weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      downloadJPEG: 'Сохранить в jpeg',
      downloadPDF: 'Сохранить в pdf',
      downloadPNG: 'Сохранить в png',
      downloadSVG: 'Сохранить в svg',
      rangeSelectorFrom: 'От',
      rangeSelectorTo: 'До',
      printChart: 'На печать',
      rangeSelectorZoom: '',
    },
  });

  const dataJSON = JSON.parse(data.plain);
  const history = [];

  const name = {};
  //  {
  //   VAC_SENSOR: 'Напряжение в сети',
  //   INTERNAL_TEMP: 'Температура в помещении',
  //   OUTSIDE_TEMP: 'Температура на улице',
  //   INTERNAL_HUMIDITY: 'Влажность в помещении',
  //   BATT_TEMP: 'Температура батареи',
  // };

  dataJSON.legend.forEach((item) => {
    name[item.alias] = item.description ? item.description : item.name;
  });

console.log('get_history', dataJSON);

  dataJSON.list.forEach((item) => {
    const newItem = {
      name: name[item.alias],
      className: `history-chart__line history-chart__line_${item.alias}`,
    };
    newItem.data = [];
    item.data.forEach((itemData) => {
      const newData = [
        itemData.x,
        itemData.y,
      ];
      newItem.data.push(newData);
    });
    history.push(newItem);
  });

  function createChart() {
    Highcharts.stockChart('сhart', {

      legend: {
        enabled: true,
        align: 'left',
      },

      colors: ['#4caf50', '#ffc107', '#6bcfe0', '#e91e63'],

      rangeSelector: {
        buttons: [],
        selected: 0,
        inputEnabled: false,
      },

      yAxis: {
        labels: {
          formatter() {
            return `${(this.value >= 0 ? '' : '')} ${this.value}`;
          },
        },
        plotLines: [{
          value: 0,
          width: 2,
          color: 'silver',
        }],
      },

      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
        valueDecimals: 2,
        split: true,
      },

      series: history,
    });
  }

  createChart();
};

export default updateHistory;
