import Iscroll from 'iscroll';

class HistoryEvents {
  constructor() {
    HistoryEvents.scrolling();
  }

  static scrolling() {
    new Iscroll('#history-scroll', {
      mouseWheel: true,
      scrollbars: 'custom',
      interactiveScrollbars: true,
      shrinkScrollbars: 'scale',
    });
  }
}

export default HistoryEvents;
