import settings from './settings';

function updatePage(data) {
    try {
        if (settings.print_debug_to_console)
            console.log("updating page");
        var json = JSON.parse(data);
        if (json["mode"] === "ARMED") {
            $('#mode__security').addClass('change__current');
            $('#mode__master').removeClass('change__current');
            $('#mode__current').text('Охрана');
        } else if (json["mode"] === "IDLE") {
            $('#mode__master').addClass('change__current');
            $('#mode__security').removeClass('change__current');
            $('#mode__current').text('Хозяин Дома');
        }
        for (var key in json) {
            try {
                var val = json[key]["last_value"];
                var elementKey = "#status__value--" + key;
                if ($(elementKey) !== "undefined") {
                    if (json[key]["par_type"] === "DOUBLE" || json[key]["par_type"] === "INTEGER") {
                        $(elementKey).text(val);
                    } else if (json[key]["par_type"] === "BOOLEAN") {
                        if (val.toString().toLowerCase() === "true") {
                            $(elementKey).addClass("true");
                        } else {
                            $(elementKey).removeClass("false");
                        }

                    }
                    if (json[key]["state"] === "Alert") {
                        console.log("Alert param " + key);
                    }
                }
                if (key === "SOCKET") { //костыль. зажигает лампочки и розетки, если они включены - нужно при перезагрузке страницы
                    if (val.toString().toLowerCase() === "true") {
                        var el = $('#socket--status');
                        $('.control__status', el).addClass('on');
                        $('.control__status', el).text('Включена');
                        $('.control__img img', el).attr('src', 'images/socket.png');
                    }
                } else if (key === "LAMP_1") { //костыль. зажигает лампочки и розетки, если они включены - нужно при перезагрузке страницы
                    if (val.toString().toLowerCase() === "true") {
                        var el = $('#lamp--first-status');
                        $('.control__status', el).addClass('on');
                        $('.control__status', el).text('Включена');
                        $('.control__img img', el).attr('src', 'images/lamp.png');
                    }
                } else if (key === "LAMP_2") { //костыль. зажигает лампочки и розетки, если они включены - нужно при перезагрузке страницы
                    if (val.toString().toLowerCase() === "true") {
                        var el = $('#lamp--second-status');
                        $('.control__status', el).addClass('on');
                        $('.control__status', el).text('Включена');
                        $('.control__img img', el).attr('src', 'images/lamp.png');
                    }
                }
            } catch (ee) {
                console.error(ee);
            }

        }

        console.log("page updated");
    } catch (e) {
        console.error(e);
    }
}

export default updatePage;
