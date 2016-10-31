import settings from './settings';

function updateSettings(data) {

    try {

        var json = data;
        for (var key in json) {
            try {
                if (settings.print_debug_to_console) {
                    console.log("loading settings " + key);
                }
                var val = json[key];
                var elementKey = "#settings__value--" + key;
                if ($(elementKey) != "undefined") {

                    $(elementKey).html(val);

                }
            } catch (ee) {
                console.error(ee);
            }

        }

        console.log("settings loaded");
    } catch (e) {
        console.error(e);
    }
}

export default updateSettings;
