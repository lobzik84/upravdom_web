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

import loadLog from '../log/loadLog';
import HistoryEvents from '../history/historyEvents';
import updateCapture from '../capture/updateCapture';
import updateBattery from '../battery/updateBattery';

import updateWeather from '../weather/updateWeather';


import updateNotifications from '../notifications/updateNotifications';


class Main {
  constructor(data) {
    let json = {};
    let notificationsJSON = {};
    if (data) {
      json = JSON.parse(data.plain);
      notificationsJSON = JSON.parse(data.notificationsPlain);
    } else {
      json = {};
      notificationsJSON = {};
    }

    json.time = moment(+json.box_time).format(commonData.format);
    nunjucks.render('main.html', json, (err, res) => {
      this.$template = $(res);
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

      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var div = document.createElement('div');
        div.innerHTML = this.responseText;
        div.style.display = 'none';
        $('body').prepend(div);
      };
      xhr.open('get', '/sprite.svg', true);
      xhr.send();

      this.events();
      this.checkDevice();
      updateBattery(json);
      updateWeather(json);

      if (notificationsJSON.length) {
        $('.dashboard-info__count').text(notificationsJSON.length);
        updateNotifications(notificationsJSON);
      }
    });
  }

  checkDevice() {
    this.device = {
      name: checkDevice(),
    };
    this.movingMode(true);
    this.toggleHeader(true);
    this.toggleHistory(true);

    $(window).on('resize', () => {
      this.device = {
        changes: this.device.name !== checkDevice(),
        name: checkDevice(),
      };
      this.movingMode(this.device.changes);
      this.toggleHeader(this.device.changes);
      this.toggleHistory(this.device.changes);
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
        $('.history-header').closest('.history').addClass('history_hide');
        $('.settings__header').closest('.settings').addClass('settings_hide');

        Main.addToggle($('.history-header'), 'history_hide', '.history');
        Main.addToggle($('.settings__header'), 'settings_hide', '.settings');
      } else {
        Main.removeToggle($('.history-header'));
        Main.removeToggle($('.settings__header'));
      }
    }
  }

  static addToggle($target, toggleClass, closest) {
    $($target).on('click', (e) => {
      $(e.currentTarget).closest(closest).toggleClass(toggleClass);
      if (toggleClass === 'history_hide' && $(e.currentTarget).not(`.${toggleClass}`)) {
        this.time = $('#status__value--box_time').data('time');
        this.timeInterval = +this.time - 24 * 60 * 60 * 1000;
        $('.history-log').remove();
        $('.history').append('<div class="history-log"></div>');
        loadLog(this.timeInterval, +this.time, 'BehaviorModule', 'INFO');
      }
    });
  }

  static removeToggle($target) {
    $target.off();
  }

  toggleHistory(changes) {
    if (changes) {
      if (this.device.name === 'mobile') {
        $('.history-chart').remove();
        $('.history-log').remove();
      } else {
        $('.history-log').remove();
        new HistoryEvents(this.$historyMode, 'history-mode__item_changed');
      }
    }
  }

  events() {
    new Mode(this.$dashboardMode, 'dashboard-mode__item_changed', true);
    new ToggleTitle(this.$panelItem);

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

    this.$template.find('#exit').on('click', () => {
      if (DEBUG) {
        console.log('Logging out...');
      }
      localStorage.clear();
      window.location.reload();
    });
  }
}

export default Main;
