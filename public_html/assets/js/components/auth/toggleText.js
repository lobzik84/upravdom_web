
class ToggleText {
  constructor(button) {
    this.$button = $(button);
    this.originalText = this.$button.text();
  }

  toggle(text, title) {
    this.$button.text(text);

    if (title) {
      this.$button.attr('title', title);
    }

    setTimeout(() => {
      this.$button.text(this.originalText);
    }, 1500);
  }
}

export default ToggleText;
