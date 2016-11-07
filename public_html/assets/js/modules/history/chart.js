import moment from 'moment';

class Chart {
  constructor(name) {
    Chart.draw(name);
  }

  static draw(name) {
    const chart = new Chartist.Line(name, {
      series: [{
        name: 'remaining',
        data: [
          { x: new Date(143134652600), y: 53 },
          { x: new Date(143334652600), y: 40 },
          { x: new Date(143354652600), y: 45 },
          { x: new Date(143356652600), y: 41 },
          { x: new Date(143366652600), y: 40 },
          { x: new Date(143368652600), y: 38 },
          { x: new Date(143378652600), y: 34 },
          { x: new Date(143568652600), y: 32 },
          { x: new Date(143569652600), y: 18 },
          { x: new Date(143579652600), y: 11 },
        ],
      }, {
        name: 'stories',
        data: [
          { x: new Date(143134652600), y: 53 },
          { x: new Date(143334652600), y: 30 },
          { x: new Date(143384652600), y: 30 },
          { x: new Date(143568652600), y: 10 },
        ],
      }],
    }, {
      axisX: {
        type: Chartist.FixedScaleAxis,
        divisor: 12,
        labelInterpolationFnc: (value) => {
          console.log(value);
          return moment(value).format('h:mm:ss');
        },
      },
      axisY: {
        onlyInteger: true,
        low: 0,
      },
      series: {
        remaining: {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false,
        },
        stories: {
          lineSmooth: false,
        },
      },
    });
  }
}

export default Chart;
