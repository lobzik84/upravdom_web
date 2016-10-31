import postData from './postData';
import decryptCapture from './decryptCapture';
import settings from './settings';

function updateCapture() {
    var kf = new KeyFile();

    var obj = {
        "action": "get_capture",
        "user_id": kf.userId,
        "box_id": kf.boxId,
        "session_key": localStorage["session_key"]
    }

    var success = function (data) {
        if (data["result"] === "success") {
            localStorage["session_key"] = data["session_key"];
            if (settings.print_debug_to_console)
                console.log("successfully loaded capture, decrypting");
            decryptCapture(kf, data);

        }

    }
    var fail = function () {
        console.error("network error while getting capture");
    }

    postData(obj, success, fail);

}

export default updateCapture;
