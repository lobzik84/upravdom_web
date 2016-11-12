import moment from 'moment';

// const chartJSON = {
//   list: [
//     {
//       name: 'sampling',
//       data: [
//         {x: 'Время первого элемента диапазона (00:00)', у: 0},
//         {x: 'Время заключительного элемента диапазона (00:00 - следующего дня)', у: 0},
//       ]
//     },
//     {
//       name: 'temperature',
//       data: [
//         {x: 'Время', у: 'Значение температуры', meta: 'Описание'},
//         {x: 'Время', у: 'Значение температуры', meta: 'Описание'},
//         {x: 'Время', у: 'Значение температуры', meta: 'Описание'},
//       ]
//     },
//   ]
// }


class Chart {
  constructor(name) {
    Chart.draw(name);
  }

  static draw(name) {

const history = [
  {
    name: 'label',
    className: 'history-chart__line_label',
    data: [
      { x: new Date('2016-11-08T00:00:00+03:00'), y: 0 },
      { x: new Date('2016-11-09T00:00:00+03:00'), y: 0 },
    ],
  },
  {
    name: 'remaining',
    className: 'history-chart__line_remaining',
    data: [
  { x: new Date('2016-11-08T00:00:00+03:00'), y: 53, meta: 'other description' },
  { x: new Date('2016-11-08T00:07:00+03:00'), y: 53, meta: 'other description' },
  { x: new Date('2016-11-08T01:23:00+03:00'), y: 40, meta: 'other description' },
  { x: new Date('2016-11-08T02:12:00+03:00'), y: 45, meta: 'other description' },
  { x: new Date('2016-11-08T04:44:00+03:00'), y: 41, meta: 'other description' },
  { x: new Date('2016-11-08T05:33:00+03:00'), y: 40, meta: 'other description' },
  { x: new Date('2016-11-08T07:45:00+03:00'), y: 38, meta: 'other description' },
  { x: new Date('2016-11-08T08:23:00+03:00'), y: 34, meta: 'other description' },
  { x: new Date('2016-11-08T09:45:00+03:00'), y: 32, meta: 'other description' },
  { x: new Date('2016-11-08T10:35:00+03:00'), y: 18, meta: 'other description' },
  { x: new Date('2016-11-08T10:55:00+03:00'), y: 11, meta: 'other description' },
  { x: new Date('2016-11-09T00:00:00+03:00'), y: 53, meta: 'other description' },
    ],
  }, {
    name: 'stories',
    className: 'history-chart__line_stories',
    data: [
    { x: new Date('2016-11-08T00:00:00+03:00'), y: 53, meta: 'other description' },
    { x: new Date('2016-11-08T00:32:00+03:00'), y: 30, meta: 'other description' },
    { x: new Date('2016-11-08T00:41:05+03:00'), y: 30, meta: 'other description' },
    { x: new Date('2016-11-08T00:55:00+03:00'), y: 10, meta: 'other description' },
    ],
  }];


    const chart = new Chartist.Line(name, {
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
  }
}

export default Chart;


//
// [
//   {
//     name: 'label',
//     className: 'history-chart__line_label',
//     data: [
//       { x: dataJSON.from, y: 0 },
//       { x: dataJSON.to, y: 0 },
//     ],
//   },
//   {
//     name: 'stories',
//     className: 'history-chart__line_stories',
//     data: [
//     { x: 1478873320000, y: 25.633977011494256, meta: 'Температура в помещении' },
//     { x: 1478874820000, y: 25.08049808429119, meta: 'Температура в помещении' },
//     { x: 1478876620000, y: 24.81464367816092, meta: 'Температура в помещении' },
//     { x: 1478878431000, y: 25.276475095785443, meta: 'Температура в помещении' },
//     ],
//   }]
