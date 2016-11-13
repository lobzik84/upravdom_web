import nunjucks from 'nunjucks';
import moment from 'moment';
import debounce from 'debounce';

import Mode from './mode';
import ToggleTitle from './toggleTitle';
import Control from './control';
import commonData from '../common/commonData';
import checkDevice from '../common/checkDevice';

import SettingsEvents from '../settings/settingsEvents';
import loadSettings from '../settings/loadSettings';

import HistoryEvents from '../history/historyEvents';
import updateCapture from '../capture/updateCapture';
import updateBattery from '../battery/updateBattery';

class Main {
  constructor(data) {
    const json = JSON.parse(data.plain);

    json.time = moment(+json.box_time).format(commonData.format);
    this.$template = $(nunjucks.render('main.html', json));
    this.$dashboardMode = this.$template.find('.dashboard-mode__item');
    this.$dashboardModeMobile = $('<div class="dashboard-mode-mobile"><div class="dashboard-mode-mobile__header">Режим работы</div></div>');
    this.$historyMode = this.$template.find('.history-mode__item');
    this.$panelItem = this.$template.find('.panel-item');
    this.$phone = this.$template.find('.settings__input_phone');
    this.elementsControl = ['LAMP_1', 'SOCKET', 'LAMP_2'];
    this.settingsSwitcher = ['plus', 'minus'];

    this.device = {};

    updateCapture();
    loadSettings();
    // грузим историю за сутки с квантом 30 минут

    $('body').empty().append(this.$template);

    this.events();
    this.checkDevice();
    updateBattery(json);
  }

  checkDevice() {
    this.device = {
      name: checkDevice(),
    };
    this.movingMode(true);
    this.toggleHeader(true);

    $(window).on('resize', () => {
      this.device = {
        changes: this.device.name !== checkDevice(),
        name: checkDevice(),
      };
      this.movingMode(this.device.changes);
      this.toggleHeader(this.device.changes);
    });
  }

  movingMode(changes) {
    if (changes) {
      if (this.device.name === 'desktop') {
        this.$dashboardMode.closest('.dashboard-mode').insertBefore('.dashboard-info');
        this.$dashboardModeMobile.remove();
      } else {
        this.$dashboardMode.closest('.dashboard-mode').appendTo(this.$dashboardModeMobile);
        this.$dashboardModeMobile.insertBefore('.settings');
      }
    }
  }

  toggleHeader(changes) {
    if (changes) {
      if (this.device.name === 'mobile') {
        Main.addToggle($('.history-header'), 'history_hide', '.history');
        Main.addToggle($('.settings__header'), 'settings_hide', '.settings');
      } else {
        Main.removeToggle($('.history-header'));
        Main.removeToggle($('.settings__header'));
      }
    }
  }

  static addToggle($target, toggleClass, closest) {
    var touchX = 0;
    var touchY = 0;

    $($target).on('touchstart', (e) => {
      const changedTouches = e.originalEvent.changedTouches;

      if (changedTouches.length === 1) {
        touchX = changedTouches[0].pageX;
        touchY = changedTouches[0].pageY;
      }
    }).on('touchend', (e) => {
      const changedTouches = e.originalEvent.changedTouches;
      e.preventDefault();

      if (touchX === changedTouches[0].pageX && touchY === changedTouches[0].pageY) {
        $(e.currentTarget).closest(closest).toggleClass(toggleClass);
      }
    });
  }

  static removeToggle($target) {
    $target.off();
  }

  events() {
    new Mode(this.$dashboardMode, 'dashboard-mode__item_changed', true);
    new ToggleTitle(this.$panelItem);
    new HistoryEvents(this.$historyMode, 'history-mode__item_changed');

    this.$phone.mask(commonData.mask);
    //  действия по кнопкам управления
    this.elementsControl.forEach((element) => {
      new Control(this.$template.find(`#${element}-status`), element);
    });

    //  действия по кнопкам настроек
    this.settingsSwitcher.forEach((signName) => {
      new SettingsEvents(this.$template.find(`.settings-options__switcher_${signName}`), signName);
    });
    new SettingsEvents(this.$template.find('.settings__checkbox'));
    new SettingsEvents(this.$template.find('.settings-form'));

    //  обновления фотографий
    this.$template.find('#update_capture').on('click', debounce(() => {
      updateCapture();
    }, 200));
  }
}

export default Main;
