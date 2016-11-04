import nunjucks from 'nunjucks';
import debounce from 'debounce';
import Iscroll from 'iscroll';
import updateCapture from '../common/updateCapture';
import loadSettings from '../common/loadSettings';
import sendCommand from '../common/sendCommand';
import historySPEC from '../history/historySPEC'; //  временный статичный json для истории


class Main {
  constructor(data) {
    const json = JSON.parse(data);
    json.history = historySPEC.history;
    this.$template = $(nunjucks.render('main.html', json));

    updateCapture();
    loadSettings();

    this.events();

    $('body').empty().append(this.$template);
    Main.historyScrolling();
  }

  events() {
    this.$template.find('.dashboard-mode__item').on('click', (event) => {
      Main.changeMode(event.currentTarget);
    });

    this.$template.find('.panel-item').on('click', (event) => {
      Main.showTitle(event.currentTarget);
    }).on('touchend mouseleave', (event) => {
      Main.hideTitle(event.currentTarget);
    });

    this.$template.find('#update_capture').on('click', () => {
      updateCapture();
    });

    //  действия по кнопкам управления
    this.$template.find('#LAMP_1-status').on('click', (event) => {
      Main.controlElements('LAMP_1', event.currentTarget);
    });
    this.$template.find('#SOCKET-status').on('click', (event) => {
      Main.controlElements('SOCKET', event.currentTarget);
    });
    this.$template.find('#LAMP_2-status').on('click', (event) => {
      Main.controlElements('LAMP_2', event.currentTarget);
    });

    //  действия по кнопкам настроек
    this.$template.find('.settings-options__switcher_plus').on('click', (event) => {
      Main.switchMinMax(event.currentTarget, '+');
    }).on('click', debounce(() => {
      Main.sendSettings();
    }, 300));
    this.$template.find('.settings-options__switcher_minus').on('click', (event) => {
      Main.switchMinMax(event.currentTarget, '-');
    }).on('click', debounce(() => {
      Main.sendSettings();
    }, 300));
  }

  static showTitle(currentTarget) {
    if ($(currentTarget).find('.panel-show').length === 0) {
      $(currentTarget).prepend(`<div class='panel-show'><span class='panel__description'>${currentTarget.title}</span></div>`);
    }
  }

  static hideTitle(currentTarget) {
    setTimeout(() => {
      $(currentTarget).find('.panel-show').remove();
    }, 1000);
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

  static historyScrolling() {
    new Iscroll('#history-scroll', {
      mouseWheel: true,
      scrollbars: 'custom',
      interactiveScrollbars: true,
      shrinkScrollbars: 'scale',
    });
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
    if (DEBUG) {
      console.log('Saving settings');
    }
  }

  static sendSettings() {
    const settingElementIdPrefix = 'settings__value--';
    const settings = {};
    const $settings = $(`[id^="${settingElementIdPrefix}"]`);

    $settings.each((index, setting) => {
      const settingName = setting.id.replace(settingElementIdPrefix, '');

      settings[settingName] = setting.innerHTML;
      if (DEBUG) {
        console.log(`${settingName} - ${setting.innerHTML}`);
      }
    });

    sendCommand('save_settings', { settings }, null);
  }
}

export default Main;
