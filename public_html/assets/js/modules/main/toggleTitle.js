class ToggleTitle {
  constructor($target) {
    $target.on('click', (event) => {
      ToggleTitle.showTitle(event.currentTarget);
    }).on('touchend mouseleave', (event) => {
      ToggleTitle.hideTitle(event.currentTarget);
    });
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

}


export default ToggleTitle;
