
class AnchorTitle {
  constructor($element, name) {
    this.$anchorTitle = $(`<div class="anchorTitle ${name}"></div>`);
    this.$element = $element;
    $('body').append(this.$anchorTitle);

    this.$element.data('description', $element.data('description'))
    .removeAttr('title')
    .on('mouseenter', () => {
      this.show();
    })
    .on('mouseleave', () => {
      this.hide();
    });
  }

  show() {
    const offset = this.$element.offset();

    this.$anchorTitle.css({
      top: `${(offset.top + this.$element.outerHeight() + 4)}px`,
      left: `${offset.left}px`,
    })
    .html(this.$element.data('description'))
    .addClass('anchorTitle_show');
  }

  hide() {
    this.$anchorTitle.removeClass('anchorTitle_show');
  }
}

export default AnchorTitle;
