import sendCommand from '../common/sendCommand';


class Mode {
  constructor($target) {
    $target.on('click', (event) => {
      Mode.changeMode(event.currentTarget);
    });
  }

  static changeMode(currentTarget) {
    const $target = $(currentTarget);
    const commandData = currentTarget.id === 'mode__master' ? { mode: 'IDLE' } : { mode: 'ARMED' };
    const changeClass = 'dashboard-mode__item_changed';

    sendCommand('switch_mode', commandData, () => {
      $target.addClass(changeClass)
      .siblings(`.${changeClass}`).removeClass(changeClass);
    });
  }
}

export default Mode;
