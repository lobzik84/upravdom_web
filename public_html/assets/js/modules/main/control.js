import sendCommand from '../common/sendCommand';

class Control {
  constructor($target, element) {
    console.log($target);

    $target.on('click', (event) => {
      Control.controlElements(element, event.currentTarget);
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
}


export default Control;
