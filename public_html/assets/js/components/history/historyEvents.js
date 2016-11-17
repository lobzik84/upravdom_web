import loadLog from '../log/loadLog';
import loadHistory from './loadHistory';


class HistoryEvents {
  constructor($target, changeClass) {
    this.$list = $('<div class="history-log"></div>');
    this.$chart = $('<div id="сhart" class="history-chart"></div>');
    this.changeClass = changeClass;
    this.$target = $target;
    this.time = $('#status__value--box_time').data('time');
    this.timeInterval = +this.time - 3 * 24 * 60 * 60 * 1000;

    this.$target.on('click', (event) => {
      this.change(event.currentTarget);
    });

    this.scrolling();
  }

  change(currentTarget) {
    this.time = $('#status__value--box_time').data('time');
    this.timeInterval = +this.time - 3 * 24 * 60 * 60 * 1000;

    if ($(currentTarget).not(`.${this.changeClass}`)) {
      if (currentTarget.id === 'history-list') {
        this.scrolling();
      } else {
        this.chart();
      }
      this.toggleClass(currentTarget);
    }
  }

  toggleClass(currentTarget) {
    $(currentTarget).addClass(this.changeClass)
    .siblings(`.${this.changeClass}`).removeClass(this.changeClass);
  }

  scrolling() {
    this.$chart.remove();
    $('.history-log').remove();
    $('.history').append(this.$list);
    setTimeout(() => {
      loadLog(this.timeInterval, +this.time, 'InstinctsModule', 'INFO');
    }, 1500);
  }

  chart() {
    this.$list.remove();
    $('.history-log').remove();
    $('.history-chart').remove();
    $('.history').append(this.$chart);
      const aliases = ['INTERNAL_TEMP', 'OUTSIDE_TEMP', 'INTERNAL_HUMIDITY', 'BATT_TEMP', 'VAC_SENSOR'];
    loadHistory(this.timeInterval, +this.time, 30 * 60 * 1000, aliases);
  }
}

export default HistoryEvents;
