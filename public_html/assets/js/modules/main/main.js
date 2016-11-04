import nunjucks from 'nunjucks';
import Iscroll from 'iscroll';

import Mode from './mode';
import ToggleTitle from './toggleTitle';
import Control from './control';
import SettingEvents from './settingEvents';

import updateCapture from '../common/updateCapture';
import loadSettings from '../common/loadSettings';
import historySPEC from '../history/historySPEC'; //  временный статичный json для истории


class Main {
  constructor(data) {
    const json = JSON.parse(data);
    json.history = historySPEC.history;
    this.$template = $(nunjucks.render('main.html', json));
    this.$dashboardMode = this.$template.find('.dashboard-mode__item');
    this.$panelItem = this.$template.find('.panel-item');
    this.elementsControl = ['LAMP_1', 'SOCKET', 'LAMP_2'];
    this.settingsSwitcher = ['plus', 'minus'];

    updateCapture();
    loadSettings();

    $('body').empty().append(this.$template);

    this.events();
    Main.historyScrolling();
  }

  events() {
    new Mode(this.$dashboardMode);
    new ToggleTitle(this.$panelItem);

    //  действия по кнопкам управления
    this.elementsControl.forEach((element) => {
      new Control(this.$template.find(`#${element}-status`), element);
    });

    //  действия по кнопкам настроек
    this.settingsSwitcher.forEach((element) => {
      new SettingEvents(this.$template.find(`.settings-options__switcher_${element}`), element);
    });

    this.$template.find('#update_capture').on('click', () => {
      updateCapture();
    });
  }

  static historyScrolling() {
    new Iscroll('#history-scroll', {
      mouseWheel: true,
      scrollbars: 'custom',
      interactiveScrollbars: true,
      shrinkScrollbars: 'scale',
    });
  }
}

export default Main;
