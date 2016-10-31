$(function () {
    if ($('#alert__temp').hasClass('alert')) {
        $('#alert__temp').css('display', 'block');
        $('#status__temp').addClass('alert');
        $('#status__temp #status__icon img').attr('src', 'images/icons/temp-a.png');
        $('.change__current').addClass('alert');
    } 
    if ($('#alert__volt').hasClass('alert')) {
        $('#alert__volt').css('display', 'block');
        $('#status__volt').addClass('alert');
        $('#status__volt #status__icon img').attr('src', 'images/icons/voltage-a.png');
        $('.change__current').addClass('alert');
    }
    if ($('#alert__door').hasClass('alert')) {
        $('#alert__door').css('display', 'block');
        $('#status__door').addClass('alert');
        $('#status__door #status__icon img').attr('src', 'images/icons/door-a.png');
        $('.change__current').addClass('alert');
    }
    if ($('#alert__smoke').hasClass('alert')) {
        $('#alert__smoke').css('display', 'block');
        $('#status__smoke').addClass('alert');
        $('#status__smoke #status__icon img').attr('src', 'images/icons/smoke-a.png');
        $('.change__current').addClass('alert');
    }
    if ($('#alert__water').hasClass('alert')) {
        $('#alert__water').css('display', 'block');
        $('#status__water').addClass('alert');
        $('#status__water #status__icon img').attr('src', 'images/icons/water-a.png');
        $('.change__current').addClass('alert');
    }
});
