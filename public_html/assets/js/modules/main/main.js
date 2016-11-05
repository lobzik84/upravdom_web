import nunjucks from 'nunjucks';

import Mode from './mode';
import ToggleTitle from './toggleTitle';
import Control from './control';
import SettingsEvents from './settingsEvents';
import HistoryEvents from './historyEvents';


import updateCapture from '../common/updateCapture';
import loadSettings from '../common/loadSettings';
import settings from '../common/settings';


import historySPEC from '../history/historySPEC'; //  временный статичный json для истории


class Main {
  constructor(data) {
    const json = JSON.parse(data);

    json.history = historySPEC.history;
    this.$template = $(nunjucks.render('main.html', json));
    this.$dashboardMode = this.$template.find('.dashboard-mode__item');
    this.$historyMode = this.$template.find('.history-mode__item');
    this.$panelItem = this.$template.find('.panel-item');
    this.$phone = this.$template.find('.settings__input_phone');
    this.elementsControl = ['LAMP_1', 'SOCKET', 'LAMP_2'];
    this.settingsSwitcher = ['plus', 'minus'];

    updateCapture();
    loadSettings();

    $('body').empty().append(this.$template);

    this.events();

    new HistoryEvents();
  }

  events() {
    new Mode(this.$dashboardMode, 'dashboard-mode__item_changed', true);
    new Mode(this.$historyMode, 'history-mode__item_changed', false);
    new ToggleTitle(this.$panelItem);

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
