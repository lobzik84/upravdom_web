
import loadLog from '../common/loadLog';
import loadHistory from '../common/loadHistory';


class HistoryEvents {
  constructor($target, changeClass) {
    this.$list = $('.history-log');
    this.$chart = $('<div class="history-chart"></div>');
    this.changeClass = changeClass;
    this.$target = $target;
    this.time = $('#status__value--box_time').data('time');

    loadLog(+this.time - 1 * 60 * 60 * 1000, +this.time, 'ModemModule', 'INFO');

    this.$target.on('click', (event) => {
      this.change(event.currentTarget);
    });

    this.scrolling();
  }

  change(currentTarget) {
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
    loadLog(+this.time - 1 * 60 * 60 * 1000, +this.time, 'ModemModule', 'INFO');
  }

  chart() {
    this.$list.remove();
    $('.history').append(this.$chart);
    loadHistory(+this.time - 24 * 60 * 60 * 1000, +this.time, 30 * 60 * 1000);
  }
}

export default HistoryEvents;
