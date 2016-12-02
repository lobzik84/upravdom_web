import loadLog from '../log/loadLog';
import loadHistory from './loadHistory';
import commonData from '../common/commonData';

class HistoryEvents {
  constructor($target, changeClass) {
    this.$list = $('<div class="history-log"></div>');
    this.$chart = $('<div id="сhart" class="history-chart"></div>');
    this.changeClass = changeClass;
    this.$target = $target;
    this.time = $('#status__value--box_time').data('time');
    this.timeInterval = +this.time - commonData.history_timeInterval;

    this.$target.on('click', (event) => {
      this.change(event.currentTarget);
    });

    this.chart();
    this.toggleClass($('#history-chart'));
  }

  change(currentTarget) {
    this.time = $('#status__value--box_time').data('time');
    this.timeInterval = +this.time - commonData.history_timeInterval;

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
    loadLog(this.timeInterval, +this.time, 'LogModule', 'INFO');
  }

  chart() {
    this.$list.remove();
    $('.history-log').remove();
    $('.history-chart').remove();
    $('.history').append(this.$chart);
    loadHistory(this.timeInterval, +this.time, 30 * 60 * 1000, commonData.history_aliases);
  }
}

export default HistoryEvents;
