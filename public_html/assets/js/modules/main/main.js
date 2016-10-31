import nunjucks from 'nunjucks';
import updateCapture from '../common/updateCapture';
import loadSettings from '../common/loadSettings';

class Main {
  constructor() {
    const $template = $(nunjucks.render('main.html'));

    updateCapture();
    loadSettings();
    $('body').empty().append($template);
  }
}

export default Main;
