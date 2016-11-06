import Iscroll from 'iscroll';
import nunjucks from 'nunjucks';

import Chart from '../history/chart';

import historySPEC from '../history/historySPEC'; //  временный статичный json для истории


class HistoryEvents {
  constructor($target, changeClass) {
    this.$list = $(nunjucks.render('history-list.html', historySPEC));
    this.$chart = $('<div class="history-chart"></div>');
    this.changeClass = changeClass;
    this.$target = $target;

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
    $('.history').append(this.$list);

    new Iscroll('#history-scroll', {
      mouseWheel: true,
      scrollbars: 'custom',
      interactiveScrollbars: true,
      shrinkScrollbars: 'scale',
    });
  }

  chart() {
    this.$list.remove();
    $('.history').append(this.$chart);

    new Chart('.history-chart');
  }
}

export default HistoryEvents;
