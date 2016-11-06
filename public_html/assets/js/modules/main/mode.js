import sendCommand from '../common/sendCommand';


class Mode {
  constructor($target, changeClass, isSending) {
    this.changeClass = changeClass;
    this.$target = $target;
    this.isSending = isSending !== false;

    this.$target.on('click', (event) => {
      this.change(event.currentTarget);
    });
  }

  toggleClass(currentTarget) {
    $(currentTarget).addClass(this.changeClass)
    .siblings(`.${this.changeClass}`).removeClass(this.changeClass);
  }

  change(currentTarget) {
    const commandData = currentTarget.id === 'mode__master' ? { mode: 'IDLE' } : { mode: 'ARMED' };

    if (this.isSending) {
      sendCommand('switch_mode', commandData, () => {
        this.toggleClass(currentTarget);
      });
    } else {
      this.toggleClass(currentTarget);
    }
  }
}

export default Mode;
