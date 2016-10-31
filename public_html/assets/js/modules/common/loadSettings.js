import postData from './postData';
import updateSettings from './updateSettings';
import settings from './settings';

function loadSettings() {
    var kf = new KeyFile();

    var obj = {
        "action": "get_settings",
        "user_id": kf.userId,
        "box_id": kf.boxId,
        "session_key": localStorage["session_key"]
    }

    var success = function (data) {
        if (data["result"] === "success") {
            localStorage["session_key"] = data["session_key"];
            if (settings.print_debug_to_console) {
                console.log("successfully loaded settings");
                console.log(data);
            }
            updateSettings(data["settings"])
        }
    };
    var fail = function () {
        console.error("network error while getting settings");
    }
    postData(obj, success, fail);

}

export default loadSettings;
