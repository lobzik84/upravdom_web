$(function () {
  $('#phone').mask('+7(999)999-99-99');
  $('#login_phone').mask('+7(999)999-99-99');

  $('.status__item').each(function () {
    $(this).click(function () {
      $('.status__tip', this).fadeIn('fast');
      setTimeout(function () {
        $('.status__tip').fadeOut('fast');
      }, 1000);
    });
  });
  $('.history__dropdown').click(function () {
      $('.history__dropdown').toggleClass('drop');
      $('.history__info').toggle();
  });
  $('.settings__dropdown').click(function() {
      $('.settings__dropdown').toggleClass('drop');
      $('.settings__options, .settings__save').toggle();
  });


  $('.history__dropdown').click(function() {
      $('html, body').animate({
          scrollTop: 600
      }, 'fast');
  });
  $('.settings__dropdown').click(function() {
      $('html, body').animate({
          scrollTop: 1200
      }, 'fast');
  });
  $('.settings__temp_min--minus').click(function() {
      var i = parseInt($('#settings__value--InTempAlertMin').text(), 10);
      i--;
      $('#settings__value--InTempAlertMin').text(i);
  });
  $('.settings__temp_min--plus').click(function() {
      var i = parseInt($('#settings__value--InTempAlertMin').text(), 10);
      i++;
      $('#settings__value--InTempAlertMin').text(i);
  });
  $('.settings__temp_max--minus').click(function() {
      var i = parseInt($('#settings__value--InTempAlertMax').text(), 10);
      i--;
      $('#settings__value--InTempAlertMax').text(i);
  });
  $('.settings__temp_max--plus').click(function() {
      var i = parseInt($('#settings__value--InTempAlertMax').text(), 10);
      i++;
      $('#settings__value--InTempAlertMax').text(i);
  });
  $('.settings__volt_min--minus').click(function() {
      var i = parseInt($('#settings__value--VACAlertMin').text(), 10);
      i = i - 5;
      $('#settings__value--VACAlertMin').text(i);
  });
  $('.settings__volt_min--plus').click(function() {
      var i = parseInt($('#settings__value--VACAlertMin').text(), 10);
      i = i + 5;
      $('#settings__value--VACAlertMin').text(i);
  });
  $('.settings__volt_max--minus').click(function() {
      var i = parseInt($('#settings__value--VACAlertMax').text(), 10);
      i = i - 5;
      $('#settings__value--VACAlertMax').text(i);
  });
  $('.settings__volt_max--plus').click(function() {
      var i = parseInt($('#settings__value--VACAlertMax').text(), 10);
      i = i + 5;
      $('#settings__value--VACAlertMax').text(i);
  });
  $('.password__save').on('touchstart', function() {
      $('.password__save').css('background', '#4caf50');
  });
  $('.password__save').on('touchend', function() {
      $('.password__save').css('background', '#444444');
  });


  /* var width = $('.history__info--table').width();
   var parentWidth = $('.history__info--table').offsetParent().width();
   var percent = 100 * width / parentWidth;
   console.log(width);
   console.log(parentWidth);
   console.log(percent);*/

  $(".history__info_inner2").scroll(function() {
      $(".history__info_inner").scrollLeft($(".history__info_inner2").scrollLeft());
  });
  $(".history__info_inner").scroll(function() {
      $(".history__info_inner2").scrollLeft($(".history__info_inner").scrollLeft());
  });

  /*$('.password__save').click(function () {
   var text = $('input')[0];
   var val = text.value;
   console.log(val);
   });*/
  console.log('ok');
});
