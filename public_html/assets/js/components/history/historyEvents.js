import loadLog from '../log/loadLog';
import loadHistory from './loadHistory';


class HistoryEvents {
  constructor($target, changeClass) {
    this.$list = $('<div class="history-log"></div>');
    this.$chart = $('<div class="history-chart"></div>');
    this.changeClass = changeClass;
    this.$target = $target;
    this.time = $('#status__value--box_time').data('time');
    this.timeInterval = +this.time - 24 * 60 * 60 * 1000;

    this.$target.on('click', (event) => {
      this.change(event.currentTarget);
    });

    this.scrolling();
  }

  change(currentTarget) {
    this.time = $('#status__value--box_time').data('time');
    this.timeInterval = +this.time - 24 * 60 * 60 * 1000;

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
    $('.history').append(this.$list);
    setTimeout(() => {
      loadLog(this.timeInterval, +this.time, 'ModemModule', 'INFO');
    }, 1500);
  }

  chart() {
    this.$list.remove();
    $('.history').append(this.$chart);
    loadHistory(this.timeInterval, +this.time, 30 * 60 * 1000);
  }
}

export default HistoryEvents;
