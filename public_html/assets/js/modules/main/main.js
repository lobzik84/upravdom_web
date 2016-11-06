import nunjucks from 'nunjucks';

import Mode from './mode';
import ToggleTitle from './toggleTitle';
import Control from './control';
import SettingsEvents from './settingsEvents';
import HistoryEvents from './historyEvents';


import updateCapture from '../common/updateCapture';
import loadSettings from '../common/loadSettings';
import settings from '../common/settings';
import checkDevice from '../common/checkDevice';

class Main {
  constructor(data) {
    const json = JSON.parse(data);

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

    $('body').empty().append(this.$template);

    this.events();
    this.checkDevice();
  }

  checkDevice() {
    this.device = {
      name: checkDevice(),
    };
    this.movingMode(true);

    $(window).on('resize', () => {
      this.device = {
        changes: this.device.name !== checkDevice(),
        name: checkDevice(),
      };
      this.movingMode(this.device.changes);
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

  events() {
    new Mode(this.$dashboardMode, 'dashboard-mode__item_changed', true);
    new ToggleTitle(this.$panelItem);
    new HistoryEvents(this.$historyMode, 'history-mode__item_changed');

    this.$phone.mask(settings.mask);

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
    this.$template.find('#update_capture').on('click', () => {
      updateCapture();
    });
  }
}

export default Main;
