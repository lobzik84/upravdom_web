import nunjucks from 'nunjucks';
import updateCapture from '../common/updateCapture';
import loadSettings from '../common/loadSettings';

class Main {
  constructor() {
    const $template = $(nunjucks.render('main.html'));

    updateCapture();
    loadSettings();

    $template.find('#update_capture').on('click', ()  => {
      updateCapture();
    });

    $('body').empty().append($template);
  }
}

export default Main;
