import nunjucks from 'nunjucks';
import updateCapture from '../common/updateCapture';
import loadSettings from '../common/loadSettings';
import sendCommand from '../common/sendCommand';

class Main {
  constructor(data) {
    this.$template = $(nunjucks.render('main.html', JSON.parse(data)));

    updateCapture();
    loadSettings();

    this.events();
    $('body').empty().append(this.$template);
  }

  events() {
    this.$template.find('#update_capture').on('click', () => {
      updateCapture();
    });

    this.$template.find('.dashboard-mode__item').on('click', (event) => {
      Main.changeMode(event.currentTarget);
    });

    this.$template.find('#LAMP_1-status').on('click', (event) => {
      Main.controlElements('LAMP_1', event.currentTarget);
    });
    this.$template.find('#SOCKET-status').on('click', (event) => {
      Main.controlElements('SOCKET', event.currentTarget);
    });
    this.$template.find('#LAMP_2-status').on('click', (event) => {
      Main.controlElements('LAMP_2', event.currentTarget);
    });
    this.$template.find('.settings-options__switcher_plus').on('click', (event) => {
      Main.switchMinMax(event.currentTarget, '+');
    });
    this.$template.find('.settings-options__switcher_minus').on('click', (event) => {
      Main.switchMinMax(event.currentTarget, '-');
    });
  }

  static changeMode(currentTarget) {
    const $target = $(currentTarget);
    const commandData = currentTarget.id === 'mode__master' ? { mode: 'IDLE' } : { mode: 'ARMED' };

    sendCommand('switch_mode', commandData, () => {
      $target.addClass('dashboard-mode__item_changed')
      .siblings('.dashboard-mode__item_changed').removeClass('dashboard-mode__item_changed');
    });
  }

  static controlElements(name, currentTarget) {
    const $target = $(currentTarget);

    if ($target.hasClass('control-item_on')) {
      sendCommand('user_command', { [name]: 'false' }, () => {
        $target.find('.control__description').text('Выключена');
        $target.addClass('control-item_off').removeClass('control-item_on');
      });
    } else {
      sendCommand('user_command', { [name]: 'true' }, () => {
        $target.find('.control__description').text('Включена');
        $target.addClass('control-item_on').removeClass('control-item_off');
      });
    }
  }

  static switchMinMax(currentTarget, sign) {
    const $target = $(currentTarget);
    const $valueBlock = $target.siblings('.settings-options__value').children('b');
    const count = $valueBlock[0].id === 'settings__value--VACAlertMin' || $valueBlock[0].id === 'settings__value--VACAlertMax' ? 5 : 1;
    let value = parseInt($valueBlock.text().replace(/[^-0-9]/gim, ''), 10);

    if (sign === '+') {
      value += count;
    } else if (sign === '-') {
      value -= count;
    }
    $valueBlock.text(value);
  }
}

export default Main;
